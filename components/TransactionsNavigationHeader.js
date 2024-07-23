import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image, Text, TouchableOpacity, View, InteractionManager, I18nManager, StyleSheet, Linking } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { LightningCustodianWallet, LightningLdkWallet, MultisigHDWallet } from '../class';
import { BitcoinUnit } from '../models/bitcoinUnits';
import Biometric from '../class/biometrics';
import loc, { formatBalance } from '../loc';
import { BlueStorageContext } from '../blue_modules/storage-context';
import ToolTipMenu from './TooltipMenu';
import { BluePrivateBalance } from '../BlueComponents';

export default class TransactionsNavigationHeader extends Component {
  static propTypes = {
    wallet: PropTypes.shape().isRequired,
    onWalletChange: PropTypes.func,
    navigation: PropTypes.shape(),
    onManageFundsPressed: PropTypes.func,
    width: PropTypes.number,
    showRBFWarning: PropTypes.bool,
    rightHeaderComponent: PropTypes.element,
  };

  static defaultProps = {
    showRBFWarning: false,
  };

  static actionKeys = {
    CopyToClipboard: 'copyToClipboard',
    WalletBalanceVisibility: 'walletBalanceVisibility',
    Refill: 'refill',
    RefillWithExternalWallet: 'qrcode',
  };

  static actionIcons = {
    Eye: {
      iconType: 'SYSTEM',
      iconValue: 'eye',
    },
    EyeSlash: {
      iconType: 'SYSTEM',
      iconValue: 'eye.slash',
    },
    Clipboard: {
      iconType: 'SYSTEM',
      iconValue: 'doc.on.doc',
    },
    Refill: {
      iconType: 'SYSTEM',
      iconValue: 'goforward.plus',
    },
    RefillWithExternalWallet: {
      iconType: 'SYSTEM',
      iconValue: 'qrcode',
    },
  };

  static getDerivedStateFromProps(props) {
    return { wallet: props.wallet, onWalletChange: props.onWalletChange };
  }

  static contextType = BlueStorageContext;
  constructor(props) {
    super(props);
    this.state = {
      wallet: props.wallet,
      walletPreviousPreferredUnit: props.wallet.getPreferredBalanceUnit(),
      allowOnchainAddress: false,
    };
  }

  menuRef = React.createRef();

  handleCopyPress = _item => {
    Clipboard.setString(formatBalance(this.state.wallet.getBalance(), this.state.wallet.getPreferredBalanceUnit()).toString());
  };

  componentDidUpdate(prevState) {
    InteractionManager.runAfterInteractions(() => {
      if (prevState.wallet.getID() !== this.state.wallet.getID() && this.state.wallet.type === LightningCustodianWallet.type) {
        this.verifyIfWalletAllowsOnchainAddress();
      }
    });
  }

  verifyIfWalletAllowsOnchainAddress = () => {
    if (this.state.wallet.type === LightningCustodianWallet.type) {
      this.state.wallet
        .allowOnchainAddress()
        .then(value => this.setState({ allowOnchainAddress: value }))
        .catch(e => {
          console.log('This Lndhub wallet does not have an onchain address API.');
          this.setState({ allowOnchainAddress: false });
        });
    }
  };

  componentDidMount() {
    this.verifyIfWalletAllowsOnchainAddress();
  }

  handleBalanceVisibility = async _item => {
    const wallet = this.state.wallet;

    const isBiometricsEnabled = await Biometric.isBiometricUseCapableAndEnabled();

    if (isBiometricsEnabled && wallet.hideBalance) {
      if (!(await Biometric.unlockWithBiometrics())) {
        return this.props.navigation.goBack();
      }
    }

    wallet.hideBalance = !wallet.hideBalance;
    this.setState({ wallet }, () => {
      this.props.onWalletChange(wallet);
    });
  };

  changeWalletBalanceUnit = () => {
    this.menuRef.current?.dismissMenu();
    let walletPreviousPreferredUnit = this.state.wallet.getPreferredBalanceUnit();
    const wallet = this.state.wallet;
    if (walletPreviousPreferredUnit === BitcoinUnit.BTC) {
      wallet.preferredBalanceUnit = BitcoinUnit.SATS;
      walletPreviousPreferredUnit = BitcoinUnit.BTC;
    } else if (walletPreviousPreferredUnit === BitcoinUnit.SATS) {
      wallet.preferredBalanceUnit = BitcoinUnit.LOCAL_CURRENCY;
      walletPreviousPreferredUnit = BitcoinUnit.SATS;
    } else if (walletPreviousPreferredUnit === BitcoinUnit.LOCAL_CURRENCY) {
      wallet.preferredBalanceUnit = BitcoinUnit.BTC;
      walletPreviousPreferredUnit = BitcoinUnit.BTC;
    } else {
      wallet.preferredBalanceUnit = BitcoinUnit.BTC;
      walletPreviousPreferredUnit = BitcoinUnit.BTC;
    }

    this.setState({ wallet, walletPreviousPreferredUnit }, () => {
      this.props.onWalletChange(wallet);
    });
  };

  manageFundsPressed = id => {
    this.props.onManageFundsPressed(id);
  };

  onPressMenuItem = id => {
    if (id === TransactionsNavigationHeader.actionKeys.WalletBalanceVisibility) {
      this.handleBalanceVisibility();
    } else if (id === TransactionsNavigationHeader.actionKeys.CopyToClipboard) {
      this.handleCopyPress();
    }
  };

  goToRbfDocs = () => Linking.openURL('https://docs.dfx.swiss/en/faq.html#why-should-i-use-a-wallet-with-rfb-support');

  toolTipMenuActions = [
    {
      id: TransactionsNavigationHeader.actionKeys.Refill,
      text: loc.lnd.refill,
      icon: TransactionsNavigationHeader.actionIcons.Refill,
    },
    {
      id: TransactionsNavigationHeader.actionKeys.RefillWithExternalWallet,
      text: loc.lnd.refill_external,
      icon: TransactionsNavigationHeader.actionIcons.RefillWithExternalWallet,
    },
  ];

  render() {
    const balance =
      !this.state.wallet.hideBalance &&
      formatBalance(this.state.wallet.getBalance(), this.state.wallet.getPreferredBalanceUnit(), true).toString();

    const stylesHook = StyleSheet.create({
      lineaderGradient: {
        minHeight: this.props.showRBFWarning ? 100 : 140,
      },
    });

    return (
      <>
        <View style={[styles.lineaderGradient, stylesHook.lineaderGradient]}>
          <Image source={require('../img/dfx/wallet-card.png')} style={[styles.chainIcon, { width: this.props.width }]} />
          <View style={styles.topContentContainer}>
            <View>
              <Text testID="WalletLabel" numberOfLines={1} style={styles.walletLabel}>
                {this.state.wallet.getLabel()}
              </Text>
              <ToolTipMenu
                onPress={this.changeWalletBalanceUnit}
                ref={this.menuRef}
                title={loc.wallets.balance}
                onPressMenuItem={this.onPressMenuItem}
                actions={
                  this.state.wallet.hideBalance
                    ? [
                        {
                          id: TransactionsNavigationHeader.actionKeys.WalletBalanceVisibility,
                          text: loc.transactions.details_balance_show,
                          icon: TransactionsNavigationHeader.actionIcons.Eye,
                        },
                      ]
                    : [
                        {
                          id: TransactionsNavigationHeader.actionKeys.WalletBalanceVisibility,
                          text: loc.transactions.details_balance_hide,
                          icon: TransactionsNavigationHeader.actionIcons.EyeSlash,
                        },
                        {
                          id: TransactionsNavigationHeader.actionKeys.CopyToClipboard,
                          text: loc.transactions.details_copy,
                          icon: TransactionsNavigationHeader.actionIcons.Clipboard,
                        },
                      ]
                }
              >
                <View style={styles.balance}>
                  {this.state.wallet.hideBalance ? (
                    <BluePrivateBalance />
                  ) : (
                    <Text
                      testID="WalletBalance"
                      key={balance} // force component recreation on balance change. To fix right-to-left languages, like Farsi
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      style={styles.walletBalance}
                    >
                      {balance}
                    </Text>
                  )}
                </View>
              </ToolTipMenu>
            </View>
            {Boolean(this.props.rightHeaderComponent) && this.props.rightHeaderComponent}
          </View>
          {this.state.wallet.type === LightningCustodianWallet.type && this.state.allowOnchainAddress && (
            <ToolTipMenu
              isMenuPrimaryAction
              isButton
              onPressMenuItem={this.manageFundsPressed}
              actions={this.toolTipMenuActions}
              buttonStyle={styles.manageFundsButton}
            >
              <Text style={styles.manageFundsButtonText}>{loc.lnd.title}</Text>
            </ToolTipMenu>
          )}
          {this.state.wallet.type === LightningLdkWallet.type && (
            <TouchableOpacity accessibilityRole="button" onPress={this.manageFundsPressed}>
              <View style={styles.manageFundsButton}>
                <Text style={styles.manageFundsButtonText}>{loc.lnd.title}</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
        {this.props.showRBFWarning && (
          <TouchableOpacity style={styles.rbfWarning} onPress={this.goToRbfDocs}>
            <Text style={styles.rbfWarningText}>{loc.wallets.warning}</Text>
            <Text style={styles.rbfWarningText}>{loc.wallets.rbf_warning}</Text>
            <Text style={styles.rbfWarningLink} onPress={this.goToRbfDocs}>
              {loc.wallets.more_info}
            </Text>
          </TouchableOpacity>
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  lineaderGradient: {
    padding: 15,
    justifyContent: 'center',
  },
  chainIcon: {
    position: 'absolute',
    left: 0,
    bottom: 0,
  },
  walletLabel: {
    backgroundColor: 'transparent',
    fontSize: 19,
    color: '#fff',
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  walletBalance: {
    backgroundColor: 'transparent',
    fontWeight: 'bold',
    fontSize: 36,
    color: '#fff',
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  manageFundsButton: {
    marginTop: 14,
    marginBottom: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 9,
    minHeight: 39,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
  },
  manageFundsButtonText: {
    fontWeight: '500',
    fontSize: 14,
    color: '#FFFFFF',
    padding: 12,
  },
  rbfWarning: {
    backgroundColor: '#FFEB3B',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  rbfWarningText: {
    color: '#072440',
    fontSize: 14,
    fontWeight: 'bold',
    marginVertical: 2,
  },
  rbfWarningLink: {
    color: '#339CFF',
    fontSize: 14,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  topContentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
});
