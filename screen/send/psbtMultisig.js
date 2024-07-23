import React, { useContext, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { useNavigation, useRoute, useTheme } from '@react-navigation/native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import { BlueButton, BlueCard, BlueSpacing10, BlueSpacing40, BlueText, SafeBlueArea } from '../../BlueComponents';
import navigationStyle from '../../components/navigationStyle';
import loc, { formatBalanceWithoutSuffix } from '../../loc';
import { BitcoinUnit } from '../../models/bitcoinUnits';
import { BlueStorageContext } from '../../blue_modules/storage-context';
import alert from '../../components/Alert';
import Biometric from '../../class/biometrics';
import Notifications from '../../blue_modules/notifications';
import { DynamicQRCode } from '../../components/DynamicQRCode';
const bitcoin = require('bitcoinjs-lib');
const BigNumber = require('bignumber.js');
const currency = require('../../blue_modules/currency');
const BlueElectrum = require('../../blue_modules/BlueElectrum');

const shortenAddress = addr => {
  return addr.substr(0, Math.floor(addr.length / 2) - 1) + '\n' + addr.substr(Math.floor(addr.length / 2) - 1, addr.length);
};

const PsbtMultisig = () => {
  const { wallets, fetchAndSaveWalletTransactions } = useContext(BlueStorageContext);
  const { navigate, setParams } = useNavigation();
  const { colors } = useTheme();
  const [flatListHeight, setFlatListHeight] = useState(0);
  const { walletID, psbtBase64, receivedPSBTBase64, launchedBy, isTxSigned } = useRoute().params;
  const [hasSigned, setHasSigned] = useState(isTxSigned);
  const [isSignign, setIsSigning] = useState(false);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [isBiometricUseCapableAndEnabled, setIsBiometricUseCapableAndEnabled] = useState(false);
  /** @type MultisigHDWallet */
  const wallet = wallets.find(w => w.getID() === walletID);
  const [psbt, setPsbt] = useState(bitcoin.Psbt.fromBase64(psbtBase64));
  const data = new Array(wallet.getM());
  const stylesHook = StyleSheet.create({
    root: {
      backgroundColor: colors.elevated,
    },
    whitespace: {
      color: colors.elevated,
    },
    textBtc: {
      color: colors.buttonAlternativeTextColor,
    },
    textBtcUnitValue: {
      color: colors.buttonAlternativeTextColor,
    },
    textFiat: {
      color: colors.alternativeTextColor,
    },
    provideSignatureButton: {
      backgroundColor: colors.buttonDisabledBackgroundColor,
    },
    provideSignatureButtonText: {
      color: colors.buttonTextColor,
    },
    vaultKeyCircle: {
      backgroundColor: colors.buttonDisabledBackgroundColor,
    },
    vaultKeyText: {
      color: colors.alternativeTextColor,
    },
    feeFiatText: {
      color: colors.alternativeTextColor,
    },
    vaultKeyCircleSuccess: {
      backgroundColor: colors.msSuccessBG,
    },
    vaultKeyTextSigned: {
      color: colors.msSuccessBG,
    },
  });

  let destination = [];
  let totalSat = 0;
  const targets = [];
  for (const output of psbt.txOutputs) {
    if (output.address && !wallet.weOwnAddress(output.address)) {
      totalSat += output.value;
      destination.push(output.address);
      targets.push({ address: output.address, value: output.value });
    }
  }
  destination = shortenAddress(destination.join(', '));
  const totalBtc = new BigNumber(totalSat).dividedBy(100000000).toNumber();
  const totalFiat = currency.satoshiToLocalCurrency(totalSat);

  const getFee = () => {
    return wallet.calculateFeeFromPsbt(psbt);
  };

  const _renderItem = el => {
    if (el.index >= howManySignaturesWeHave) return _renderItemUnsigned(el);
    else return _renderItemSigned(el);
  };

  const _renderItemUnsigned = el => {
    return (
      <View testID="ItemUnsigned">
        <View style={styles.itemUnsignedWrapper}>
          <View style={[styles.vaultKeyCircle, stylesHook.vaultKeyCircle]}>
            <Text style={[styles.vaultKeyText, stylesHook.vaultKeyText]}>{el.index + 1}</Text>
          </View>
          <View style={styles.vaultKeyTextWrapper}>
            <Text style={[styles.vaultKeyText, stylesHook.vaultKeyText]}>
              {loc.formatString(loc.multisig.vault_key, { number: el.index + 1 })}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const _renderItemSigned = el => {
    return (
      <View style={styles.flexDirectionRow} testID="ItemSigned">
        <View style={[styles.vaultKeyCircleSuccess, stylesHook.vaultKeyCircleSuccess]}>
          <Icon size={24} name="check" type="ionicons" color={colors.msSuccessCheck} />
        </View>
        <View style={styles.vaultKeyTextSignedWrapper}>
          <Text style={[styles.vaultKeyTextSigned, stylesHook.vaultKeyTextSigned]}>
            {loc.formatString(loc.multisig.vault_key, { number: el.index + 1 })}
          </Text>
        </View>
      </View>
    );
  };

  useEffect(() => {
    if (receivedPSBTBase64) {
      _combinePSBT();
      setParams({ receivedPSBTBase64: undefined });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receivedPSBTBase64]);

  useEffect(() => {
    Biometric.isBiometricUseCapableAndEnabled().then(setIsBiometricUseCapableAndEnabled);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const _combinePSBT = () => {
    try {
      const receivedPSBT = bitcoin.Psbt.fromBase64(receivedPSBTBase64);
      const newPsbt = psbt.combine(receivedPSBT);
      setPsbt(newPsbt);
    } catch (error) {
      alert(error);
    }
  };

  const onSign = async () => {
    try {
      setIsSigning(true);
      setHasSigned(true);
      await new Promise(resolve => setTimeout(resolve, 100));
      wallet.cosignPsbt(psbt);
    } catch (_) { }
    setIsSigning(false);
  }

  const broadcast = async transaction => {
    await BlueElectrum.ping();
    await BlueElectrum.waitTillConnected();

    if (isBiometricUseCapableAndEnabled) {
      if (!(await Biometric.unlockWithBiometrics())) {
        return;
      }
    }

    const result = await wallet.broadcastTx(transaction);
    if (!result) {
      throw new Error(loc.errors.broadcast);
    }

    return result;
  };

  const send = async (tx, fee) => {
    await broadcast(tx);
    const txid = bitcoin.Transaction.fromHex(tx).getId();
    Notifications.majorTomToGroundControl([], [], [txid]);
    ReactNativeHapticFeedback.trigger('notificationSuccess', { ignoreAndroidSystemSettings: false });
    const amount = formatBalanceWithoutSuffix(totalSat, BitcoinUnit.BTC, false);
    navigate('Success', {
      fee: Number(fee),
      amount,
    });
    await new Promise(resolve => setTimeout(resolve, 3000)); // sleep to make sure network propagates
    fetchAndSaveWalletTransactions(walletID);
  }

  const onConfirm = () => {
    setIsBroadcasting(true);
    try {
      psbt.finalizeAllInputs();
    } catch (_) {} // ignore if it is already finalized

    if (launchedBy) {
      // we must navigate back to the screen who requested psbt (instead of broadcasting it ourselves)
      // most likely for LN channel opening
      navigate(launchedBy, { psbt });
      return;
    }

    try {
      const tx = psbt.extractTransaction().toHex();
      const fee = new BigNumber(getFee()).dividedBy(100000000).toNumber();
      send(tx, fee);
      setIsBroadcasting(false);
    } catch (error) {
      setIsBroadcasting(false);
      alert(error);
    }
  };

  const howManySignaturesWeHave = wallet.calculateHowManySignaturesWeHaveFromPsbt(psbt);
  const isConfirmEnabled = () => {
    return howManySignaturesWeHave >= wallet.getM();
  };

  const destinationAddress = () => {
    // eslint-disable-next-line prefer-const
    let destinationAddressView = [];
    const whitespace = '_';
    const destinations = Object.entries(destination.split(','));
    for (const [index, address] of destinations) {
      if (index > 1) {
        destinationAddressView.push(
          <View style={styles.destinationTextContainer} key={`end-${index}`}>
            <Text numberOfLines={0} style={[styles.textDestinationFirstFour, stylesHook.textFiat]}>
              and {destinations.length - 2} more...
            </Text>
          </View>,
        );
        break;
      } else {
        const currentAddress = address;
        const firstFour = currentAddress.substring(0, 5);
        const lastFour = currentAddress.substring(currentAddress.length - 5, currentAddress.length);
        const middle = currentAddress.split(firstFour)[1].split(lastFour)[0];
        destinationAddressView.push(
          <View style={styles.destinationTextContainer} key={`${currentAddress}-${index}`}>
            <Text style={styles.textAlignCenter}>
              <Text numberOfLines={2} style={[styles.textDestinationFirstFour, stylesHook.textBtc]}>
                {firstFour}
                <Text style={stylesHook.whitespace}>{whitespace}</Text>
                <Text style={[styles.textDestination, stylesHook.textFiat]}>{middle}</Text>
                <Text style={stylesHook.whitespace}>{whitespace}</Text>
                <Text style={[styles.textDestinationFirstFour, stylesHook.textBtc]}>{lastFour}</Text>
              </Text>
            </Text>
          </View>,
        );
      }
    }
    return destinationAddressView;
  };

  const header = (
    <View style={stylesHook.root}>
      <View style={styles.containerText}>
        <BlueText style={[styles.textBtc, stylesHook.textBtc]}>{totalBtc}</BlueText>
        <View style={styles.textBtcUnit}>
          <BlueText style={[styles.textBtcUnitValue, stylesHook.textBtcUnitValue]}> {BitcoinUnit.BTC}</BlueText>
        </View>
      </View>
      <View style={styles.containerText}>
        <BlueText style={[styles.textFiat, stylesHook.textFiat]}>{totalFiat}</BlueText>
      </View>
      <View>{destinationAddress()}</View>
    </View>
  );

  const onLayout = e => {
    setFlatListHeight(e.nativeEvent.layout.height);
  };

  return (
    <SafeBlueArea style={stylesHook.root}>
      <View style={styles.container}>
        <View style={styles.mstopcontainer}>
          <View style={styles.mscontainer}>
            <View style={[styles.msleft, { height: flatListHeight - 120 }]} />
          </View>
          <View style={styles.msright}>
            <BlueCard>
              <FlatList
                data={data}
                onLayout={onLayout}
                renderItem={_renderItem}
                keyExtractor={(_item, index) => `${index}`}
                ListHeaderComponent={header}
              />
            </BlueCard>
        </View>
      </View>
      <View style={styles.bottomWrapper}>
        <View style={styles.bottomFeesWrapper}>
          <BlueText style={[styles.feeFiatText, stylesHook.feeFiatText]}>
            {loc.formatString(loc.multisig.fee, { number: currency.satoshiToLocalCurrency(getFee()) })} -{' '}
          </BlueText>
          <BlueText>{loc.formatString(loc.multisig.fee_btc, { number: currency.satoshiToBTC(getFee()) })}</BlueText>
        </View>
      </View>
      </View>
      {isTxSigned ? (
        <>
          <BlueSpacing10 />
          <DynamicQRCode value={psbt.toHex()} />
          <BlueSpacing40 />
        </>
      ) : (
        <View style={styles.marginConfirmButton}>
          <BlueButton
            disabled={hasSigned || isConfirmEnabled()}
            title={'Sign'}
            isLoading={isSignign}
            onPress={onSign}
            testID="PsbtMultisigSignButton"
          />
          <BlueSpacing10 />
          <BlueButton
            disabled={!isConfirmEnabled()}
            loading={isBroadcasting}
            title={loc.send.confirm_sendNow}
            onPress={onConfirm}
            testID="PsbtMultisigConfirmButton"
          />
        </View>
      )}
    </SafeBlueArea>
  );
};

const styles = StyleSheet.create({
  mstopcontainer: {
    flex: 1,
    flexDirection: 'row',
  },
  mscontainer: {
    flex: 10,
  },
  msleft: {
    width: 1,
    borderStyle: 'dashed',
    borderWidth: 0.8,
    borderColor: '#c4c4c4',
    marginLeft: 40,
    marginTop: 130,
  },
  msright: {
    flex: 90,
    marginLeft: '-11%',
  },
  container: {
    flexDirection: 'column',
    paddingTop: 18,
    flex: 1,
  },
  containerText: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  destinationTextContainer: {
    flexDirection: 'row',
    marginBottom: 4,
    paddingHorizontal: 60,
    fontSize: 14,
    justifyContent: 'center',
  },
  textFiat: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 22,
  },
  textBtc: {
    fontWeight: 'bold',
    fontSize: 30,
  },
  textAlignCenter: {
    textAlign: 'center',
  },
  textDestinationFirstFour: {
    fontSize: 14,
  },
  textDestination: {
    paddingTop: 10,
    paddingBottom: 40,
    fontSize: 14,
    flexWrap: 'wrap',
  },
  provideSignatureButton: {
    marginTop: 24,
    marginLeft: 40,
    height: 48,
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  provideSignatureButtonText: { fontWeight: '600', fontSize: 15 },
  vaultKeyText: { fontSize: 18, fontWeight: 'bold' },
  vaultKeyTextWrapper: { justifyContent: 'center', alignItems: 'center', paddingLeft: 16 },
  vaultKeyCircle: {
    width: 42,
    height: 42,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vaultKeyCircleSuccess: {
    width: 42,
    height: 42,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemUnsignedWrapper: { flexDirection: 'row', paddingTop: 16 },
  vaultKeyTextSigned: { fontSize: 18, fontWeight: 'bold' },
  vaultKeyTextSignedWrapper: { justifyContent: 'center', alignItems: 'center', paddingLeft: 16 },
  flexDirectionRow: { flexDirection: 'row', paddingVertical: 12 },
  textBtcUnit: { justifyContent: 'flex-end' },
  bottomFeesWrapper: { justifyContent: 'center', alignItems: 'center', flexDirection: 'row' },
  marginConfirmButton: { marginTop: 16, marginHorizontal: 32, marginBottom: 48 },
  height80: {
    height: 80,
  },
  footerSpacing: {
    height: 100,
  },
});

PsbtMultisig.navigationOptions = navigationStyle({}, opts => ({ ...opts, title: loc.multisig.header }));

export default PsbtMultisig;
