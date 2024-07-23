import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { View, Text, StatusBar, ScrollView, BackHandler, TouchableOpacity, StyleSheet, I18nManager, Image, Platform, ActivityIndicator } from 'react-native';
import Share from 'react-native-share';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { Icon } from 'react-native-elements';
import QRCodeComponent from '../../components/QRCodeComponent';
import { useNavigation, useNavigationState, useRoute, useTheme } from '@react-navigation/native';
import {
  BlueLoading,
  BlueText,
  SafeBlueArea,
  BlueButton,
  BlueCopyTextToClipboard,
  BlueSpacing20,
  BlueTextCentered,
  SecondButton,
  BlueSpacing10,
} from '../../BlueComponents';
import navigationStyle from '../../components/navigationStyle';
import loc from '../../loc';
import { BlueStorageContext } from '../../blue_modules/storage-context';
import { BitcoinUnit } from '../../models/bitcoinUnits';
import { SuccessView } from '../send/success';
import LNDCreateInvoice from './lndCreateInvoice';
import { useNFC } from '../../hooks/nfc.hook';
import BoltCard from '../../class/boltcard';

const LNDViewInvoice = () => {
  const { invoice, walletID } = useRoute().params;
  const { wallets, setSelectedWallet, fetchAndSaveWalletTransactions } = useContext(BlueStorageContext);
  const wallet = wallets.find(w => w.getID() === walletID);
  const { colors, closeImage } = useTheme();
  const { goBack, navigate, setParams, setOptions, getParent } = useNavigation();
  const [isLoading, setIsLoading] = useState(typeof invoice === 'string');
  const [isFetchingInvoices, setIsFetchingInvoices] = useState(true);
  const [invoiceStatusChanged, setInvoiceStatusChanged] = useState(false);
  const [qrCodeSize, setQRCodeSize] = useState(90);
  const fetchInvoiceInterval = useRef();
  const [isLoadingNfcInvoice, setIsLoadingNfcInvoice] = useState(false);
  const isModal = useNavigationState(state => state.routeNames[0] === LNDCreateInvoice.routeName);
  const { isNfcActive, startReading, stopReading } = useNFC();
  
  const stylesHook = StyleSheet.create({
    root: {
      backgroundColor: colors.background,
    },
    detailsText: {
      color: colors.buttonTextColor,
    },
    expired: {
      backgroundColor: colors.success,
    },
    details: {
      backgroundColor: colors.lightButton,
    },
  });

  const handleNfcRead = useCallback(
    async payload => {
      setIsLoadingNfcInvoice(true);
      if (BoltCard.isBoltcardWidthdrawUrl(payload)) {
        await stopReading();
        const { isError, reason } = await BoltCard.widthdraw(payload, invoice.payment_request);
        if (isError) {
          alert(reason);
          setIsLoadingNfcInvoice(false);
        }
      }
    },
    [invoice.payment_request],
  );

  const handleStartReadingNfc = async () => {
    startReading(handleNfcRead)
  }

  useEffect(() => {
    if (!invoice?.payment_request || isLoading) return;
    if (Platform.OS === 'android' && !isNfcActive) {
      handleStartReadingNfc();
    }
    return () => {
      stopReading();
    };
  }, [invoice.payment_request, isLoading]);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
      clearInterval(fetchInvoiceInterval.current);
      fetchInvoiceInterval.current = undefined;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    isModal &&
      setOptions({
        headerStyle: {
          borderBottomWidth: 0,
          backgroundColor: colors.customHeader,
          elevation: 0,
          shadowOpacity: 0,
          shadowOffset: { height: 0, width: 0 },
        },
        gestureEnabled: false,
        headerBackVisible: false,
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colors, isModal]);

  useEffect(() => {
    const isPaid = invoice.ispaid || invoice.type === 'paid_invoice';
    if (isPaid) {
      setOptions({
        title: '',
        headerRight: () => (
          <TouchableOpacity accessibilityRole="button" style={[styles.details, stylesHook.details]} onPress={navigateToPreImageScreen}>
            <Text style={[styles.detailsText, stylesHook.detailsText]}>{loc.send.create_details}</Text>
          </TouchableOpacity>
        ),
      });
    }
  }, [invoice]);

  useEffect(() => {
    setSelectedWallet(walletID);
    console.log('LNDViewInvoice - useEffect');
    if (!invoice.ispaid) {
      fetchInvoiceInterval.current = setInterval(async () => {
        if (isFetchingInvoices) {
          try {
            const userInvoices = await wallet.getUserInvoices(20);
            // fetching only last 20 invoices
            // for invoice that was created just now - that should be enough (it is basically the last one, so limit=1 would be sufficient)
            // but that might not work as intended IF user creates 21 invoices, and then tries to check the status of invoice #0, it just wont be updated
            const updatedUserInvoice = userInvoices.filter(filteredInvoice =>
              typeof invoice === 'object'
                ? filteredInvoice.payment_request === invoice.payment_request
                : filteredInvoice.payment_request === invoice,
            )[0];
            if (typeof updatedUserInvoice !== 'undefined') {
              setInvoiceStatusChanged(true);
              setParams({ invoice: updatedUserInvoice });
              setIsLoading(false);
              if (updatedUserInvoice.ispaid) {
                // we fetched the invoice, and it is paid :-)
                setIsFetchingInvoices(false);
                fetchAndSaveWalletTransactions(walletID);
              } else {
                const currentDate = new Date();
                const now = (currentDate.getTime() / 1000) | 0; // eslint-disable-line no-bitwise
                const invoiceExpiration = updatedUserInvoice.timestamp + updatedUserInvoice.expire_time;
                if (invoiceExpiration < now && !updatedUserInvoice.ispaid) {
                  // invoice expired :-(
                  fetchAndSaveWalletTransactions(walletID);
                  setIsFetchingInvoices(false);
                  ReactNativeHapticFeedback.trigger('notificationError', { ignoreAndroidSystemSettings: false });
                  clearInterval(fetchInvoiceInterval.current);
                  fetchInvoiceInterval.current = undefined;
                }
              }
            }
          } catch (error) {
            console.log(error);
          }
        }
      }, 3000);
    } else {
      setIsFetchingInvoices(false);
      clearInterval(fetchInvoiceInterval.current);
      fetchInvoiceInterval.current = undefined;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBackButton = () => {
    goBack(null);
    return true;
  };

  const navigateToPreImageScreen = () => {
    navigate('LNDViewAdditionalInvoicePreImage', {
      invoice,
      preImageData: invoice.payment_preimage && typeof invoice.payment_preimage === 'string' ? invoice.payment_preimage : 'none',
    });
  };

  const handleOnSharePressed = () => {
    Share.open({ message: `lightning:${invoice.payment_request}` }).catch(error => console.log(error));
  };

  useEffect(() => {
    if (invoice.ispaid && invoiceStatusChanged) {
      setInvoiceStatusChanged(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoice]);

  useEffect(() => {
    if (invoiceStatusChanged) {
      ReactNativeHapticFeedback.trigger('notificationSuccess', { ignoreAndroidSystemSettings: false });
    }
  }, [invoiceStatusChanged]);

  const onLayout = e => {
    const { height, width } = e.nativeEvent.layout;
    setQRCodeSize(height > width ? width - 40 : e.nativeEvent.layout.width / 1.8);
  };

  const render = () => {
    if (isLoading) {
      return (
        <View style={[styles.root, stylesHook.root]}>
          <BlueLoading />
        </View>
      );
    }

    if (typeof invoice === 'object') {
      const currentDate = new Date();
      const now = (currentDate.getTime() / 1000) | 0; // eslint-disable-line no-bitwise
      const invoiceExpiration = invoice.timestamp + invoice.expire_time;
      if (invoice.ispaid || invoice.type === 'paid_invoice') {
        let amount = 0;
        if (invoice.type === 'paid_invoice' && invoice.value) {
          amount = invoice.value;
        } else if (invoice.type === 'user_invoice' && invoice.amt) {
          amount = invoice.amt;
        }
        let description = invoice.description;
        if (invoice.memo && invoice.memo.length > 0) {
          description = invoice.memo;
        }
        return (
          <View style={styles.root}>
            <SuccessView
              amount={amount}
              paymentHash={invoice.payment_hash}
              fee={invoice.fee}
              amountUnit={BitcoinUnit.SATS}
              invoiceDescription={description}
              shouldAnimate={invoiceStatusChanged}
              walletID={walletID}
            />
          </View>
        );
      }
      if (invoiceExpiration < now) {
        return (
          <View style={[styles.root, stylesHook.root, styles.justifyContentCenter]}>
            <View style={[styles.expired, stylesHook.expired]}>
              <Icon name="times" size={50} type="font-awesome" color={colors.successCheck} />
            </View>
            <BlueTextCentered>{loc.lndViewInvoice.wasnt_paid_and_expired}</BlueTextCentered>
          </View>
        );
      }
      // Invoice has not expired, nor has it been paid for.
      return (
        <ScrollView>
          <View style={[styles.activeRoot, stylesHook.root]}>
            <View style={styles.activeQrcode}>
              <QRCodeComponent value={invoice.payment_request} size={qrCodeSize} />
            </View>
            <BlueSpacing20 />
            <BlueText>
              {loc.lndViewInvoice.please_pay} {invoice.amt} {loc.lndViewInvoice.sats}
            </BlueText>
            {'description' in invoice && invoice.description.length > 0 && (
              <BlueText>
                {loc.lndViewInvoice.for} {invoice.description}
              </BlueText>
            )}
            <BlueCopyTextToClipboard truncated text={invoice.payment_request} />
            <View>
              <BlueButton onPress={handleOnSharePressed} title={loc.receive.details_share} />
              <BlueSpacing10 />
              {isLoadingNfcInvoice ? (
                <ActivityIndicator />
              ) : (
                Platform.select({
                  ios: (
                    <SecondButton onPress={handleStartReadingNfc} title={'Use Boltcard'} image={{ source: require('../../img/bolt-card.png') }} />
                  ),
                  android: (
                    <View style={styles.buttonsContainer}>
                      <Image source={require('../../img/bolt-card.png')} style={{ width: 40, height: 40 }} />
                    </View>
                  ),
                })
              )}
            </View>
          </View>
        </ScrollView>
      );
    }
  };

  return (
    <SafeBlueArea onLayout={onLayout}>
      <StatusBar barStyle="default" />
      {render()}
    </SafeBlueArea>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'space-between',
  },
  justifyContentCenter: {
    justifyContent: 'center',
  },
  details: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    borderRadius: 8,
    height: 34,
  },
  detailsText: {
    fontSize: 15,
    fontWeight: '600',
  },
  expired: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  activeRoot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activeQrcode: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  buttonsContainer: {
    alignItems: 'center',
  }
});

LNDViewInvoice.navigationOptions = navigationStyle({}, opts => ({
  ...opts,
  title: loc.lndViewInvoice.lightning_invoice,
}));

export default LNDViewInvoice;
