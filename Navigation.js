import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@react-navigation/native';

import Settings from './screen/settings/settings';
import About from './screen/settings/about';
import ReleaseNotes from './screen/settings/releasenotes';
import Licensing from './screen/settings/licensing';
import Selftest from './screen/selftest';
import Language from './screen/settings/language';
import Currency from './screen/settings/currency';
import EncryptStorage from './screen/settings/encryptStorage';
import PlausibleDeniability from './screen/plausibledeniability';
import LightningSettings from './screen/settings/lightningSettings';
import ElectrumSettings from './screen/settings/electrumSettings';
import TorSettings from './screen/settings/torSettings';
import Tools from './screen/settings/tools';
import GeneralSettings from './screen/settings/GeneralSettings';
import NetworkSettings from './screen/settings/NetworkSettings';
import NotificationSettings from './screen/settings/notificationSettings';
import DefaultView from './screen/settings/defaultView';

import WalletHome from './screen/wallets/home';
import AddWallet from './screen/wallets/add';
import WalletsAddMultisig from './screen/wallets/addMultisig';
import WalletsAddMultisigStep2 from './screen/wallets/addMultisigStep2';
import WalletsAddMultisigHelp from './screen/wallets/addMultisigHelp';
import PleaseBackup from './screen/wallets/pleaseBackup';
import PleaseBackupLNDHub from './screen/wallets/pleaseBackupLNDHub';
import PleaseBackupLdk from './screen/wallets/pleaseBackupLdk';
import ImportWallet from './screen/wallets/import';
import ImportWalletDiscovery from './screen/wallets/importDiscovery';
import ImportCustomDerivationPath from './screen/wallets/importCustomDerivationPath';
import ImportSpeed from './screen/wallets/importSpeed';
import WalletDetails from './screen/wallets/details';
import WalletExport from './screen/wallets/export';
import ExportMultisigCoordinationSetup from './screen/wallets/exportMultisigCoordinationSetup';
import ViewEditMultisigCosigners from './screen/wallets/viewEditMultisigCosigners';
import WalletXpub from './screen/wallets/xpub';
import SignVerify from './screen/wallets/signVerify';
import WalletAddresses from './screen/wallets/addresses';
import ReorderWallets from './screen/wallets/reorderWallets';
import SelectWallet from './screen/wallets/selectWallet';
import ProvideEntropy from './screen/wallets/provideEntropy';

import TransactionDetails from './screen/transactions/details';
import TransactionStatus from './screen/transactions/transactionStatus';
import CPFP from './screen/transactions/CPFP';
import RBFBumpFee from './screen/transactions/RBFBumpFee';
import RBFCancel from './screen/transactions/RBFCancel';

import ReceiveDetails from './screen/receive/details';
import AztecoRedeem from './screen/receive/aztecoRedeem';

import SendDetails from './screen/send/details';
import ScanQRCode from './screen/send/ScanQRCode';
import SendCreate from './screen/send/create';
import Confirm from './screen/send/confirm';
import PsbtWithHardwareWallet from './screen/send/psbtWithHardwareWallet';
import PsbtMultisig from './screen/send/psbtMultisig';
import PsbtMultisigQRCode from './screen/send/psbtMultisigQRCode';
import Success from './screen/send/success';
import Broadcast from './screen/send/broadcast';
import IsItMyAddress from './screen/send/isItMyAddress';
import CoinControl from './screen/send/coinControl';

import ScanLndInvoice from './screen/lnd/scanLndInvoice';
import LappBrowser from './screen/lnd/browser';
import LNDCreateInvoice from './screen/lnd/lndCreateInvoice';
import LNDViewInvoice from './screen/lnd/lndViewInvoice';
import LdkOpenChannel from './screen/lnd/ldkOpenChannel';
import LdkInfo from './screen/lnd/ldkInfo';
import LNDViewAdditionalInvoiceInformation from './screen/lnd/lndViewAdditionalInvoiceInformation';
import LnurlPay from './screen/lnd/lnurlPay';
import LnurlPaySuccess from './screen/lnd/lnurlPaySuccess';
import LnurlAuth from './screen/lnd/lnurlAuth';
import UnlockWith from './UnlockWith';
import { isDesktop } from './blue_modules/environment';
import SettingsPrivacy from './screen/settings/SettingsPrivacy';
import LNDViewAdditionalInvoicePreImage from './screen/lnd/lndViewAdditionalInvoicePreImage';
import LdkViewLogs from './screen/wallets/ldkViewLogs';
import BackupExplanation from './screen/wallets/dfx/backup-explanation';
import { BlueStorageContext } from './blue_modules/storage-context';
import Sell from './screen/dfx/sell';
import PaymentCode from './screen/wallets/paymentCode';
import PaymentCodesList from './screen/wallets/paymentCodesList';
import loc from './loc';
import Asset from './screen/wallets/asset';
import AddLightning from './screen/wallets/dfx/add-lightning';
import LNDReceive from './screen/lnd/lndReceive';
import FeatureFlags from './screen/settings/FeatureFlags';
import AddBoltcard from './screen/boltcard/add';
import BoltcardDetails from './screen/boltcard/details';
import BackupBolcard from './screen/boltcard/backup';
import DeleteBolcard from './screen/boltcard/delete';
import WrittenCardError from './screen/boltcard/writtenCardError';
import TappedCardDetails from './screen/wallets/tappedCardDetails';

const WalletsStack = createNativeStackNavigator();

const WalletsRoot = () => {
  const theme = useTheme();

  return (
    <WalletsStack.Navigator screenOptions={{ headerShadowVisible: false }}>
      <WalletsStack.Screen name="WalletTransactions" component={WalletHome} options={WalletHome.navigationOptions(theme)} />
      <WalletsStack.Screen name="WalletAsset" component={Asset} options={Asset.navigationOptions(theme)} />
      <WalletsStack.Screen name="AddLightning" component={AddLightning} options={AddLightning.navigationOptions(theme)} />
      <AddWalletStack.Screen
        name="WalletsAddMultisig"
        component={WalletsAddMultisig}
        options={WalletsAddMultisig.navigationOptions(theme)}
      />
      <AddWalletStack.Screen
        name="WalletsAddMultisigStep2"
        component={WalletsAddMultisigStep2}
        options={WalletsAddMultisigStep2.navigationOptions(theme)}
      />
      <WalletsStack.Screen name="AddBoltcard" component={AddBoltcard} options={AddBoltcard.navigationOptions(theme)} />
      <WalletsStack.Screen name="BoltCardDetails" component={BoltcardDetails} options={BoltcardDetails.navigationOptions(theme)} />
      <WalletsStack.Screen name="BackupBoltcard" component={BackupBolcard} options={BackupBolcard.navigationOptions(theme)} />
      <WalletsStack.Screen name="DeleteBoltcard" component={DeleteBolcard} options={DeleteBolcard.navigationOptions(theme)} />
      <WalletsStack.Screen name="WrittenCardError" component={WrittenCardError} options={WrittenCardError.navigationOptions(theme)} />
      <WalletsStack.Screen name="TappedCardDetails" component={TappedCardDetails} options={TappedCardDetails.navigationOptions(theme)} />
      <WalletsStack.Screen name="LdkOpenChannel" component={LdkOpenChannel} options={LdkOpenChannel.navigationOptions(theme)} />
      <WalletsStack.Screen name="LdkInfo" component={LdkInfo} options={LdkInfo.navigationOptions(theme)} />
      <WalletsStack.Screen name="WalletDetails" component={WalletDetails} options={WalletDetails.navigationOptions(theme)} />
      <WalletsStack.Screen name="LdkViewLogs" component={LdkViewLogs} options={LdkViewLogs.navigationOptions(theme)} />
      <WalletsStack.Screen name="TransactionDetails" component={TransactionDetails} options={TransactionDetails.navigationOptions(theme)} />
      <WalletsStack.Screen name="TransactionStatus" component={TransactionStatus} options={TransactionStatus.navigationOptions(theme)} />
      <WalletsStack.Screen name="CPFP" component={CPFP} options={CPFP.navigationOptions(theme)} />
      <WalletsStack.Screen name="RBFBumpFee" component={RBFBumpFee} options={RBFBumpFee.navigationOptions(theme)} />
      <WalletsStack.Screen name="RBFCancel" component={RBFCancel} options={RBFCancel.navigationOptions(theme)} />
      <WalletsStack.Screen name="Settings" component={Settings} options={Settings.navigationOptions(theme)} />
      <WalletsStack.Screen name="SelectWallet" component={SelectWallet} options={SelectWallet.navigationOptions(theme)} />
      <WalletsStack.Screen name="Currency" component={Currency} options={Currency.navigationOptions(theme)} />
      <WalletsStack.Screen name="About" component={About} options={About.navigationOptions(theme)} />
      <WalletsStack.Screen name="ReleaseNotes" component={ReleaseNotes} options={ReleaseNotes.navigationOptions(theme)} />
      <WalletsStack.Screen name="Selftest" component={Selftest} options={Selftest.navigationOptions(theme)} />
      <WalletsStack.Screen name="Licensing" component={Licensing} options={Licensing.navigationOptions(theme)} />
      <WalletsStack.Screen name="DefaultView" component={DefaultView} options={DefaultView.navigationOptions(theme)} />
      <WalletsStack.Screen name="Language" component={Language} options={Language.navigationOptions(theme)} />
      <WalletsStack.Screen name="EncryptStorage" component={EncryptStorage} options={EncryptStorage.navigationOptions(theme)} />
      <WalletsStack.Screen name="GeneralSettings" component={GeneralSettings} options={GeneralSettings.navigationOptions(theme)} />
      <WalletsStack.Screen name="FeatureFlags" component={FeatureFlags} options={FeatureFlags.navigationOptions(theme)} />
      <WalletsStack.Screen name="NetworkSettings" component={NetworkSettings} options={NetworkSettings.navigationOptions(theme)} />
      <WalletsStack.Screen
        name="NotificationSettings"
        component={NotificationSettings}
        options={NotificationSettings.navigationOptions(theme)}
      />
      <WalletsStack.Screen
        name="PlausibleDeniability"
        component={PlausibleDeniability}
        options={PlausibleDeniability.navigationOptions(theme)}
      />
      <WalletsStack.Screen name="LightningSettings" component={LightningSettings} options={LightningSettings.navigationOptions(theme)} />
      <WalletsStack.Screen name="ElectrumSettings" component={ElectrumSettings} options={ElectrumSettings.navigationOptions(theme)} />
      <WalletsStack.Screen name="TorSettings" component={TorSettings} options={TorSettings.navigationOptions(theme)} />
      <WalletsStack.Screen name="SettingsPrivacy" component={SettingsPrivacy} options={SettingsPrivacy.navigationOptions(theme)} />
      <WalletsStack.Screen name="Tools" component={Tools} options={Tools.navigationOptions(theme)} />
      <WalletsStack.Screen name="LNDViewInvoice" component={LNDViewInvoice} options={LNDViewInvoice.navigationOptions(theme)} />
      <WalletsStack.Screen
        name="LNDViewAdditionalInvoiceInformation"
        component={LNDViewAdditionalInvoiceInformation}
        options={LNDViewAdditionalInvoiceInformation.navigationOptions(theme)}
      />
      <WalletsStack.Screen
        name="LNDViewAdditionalInvoicePreImage"
        component={LNDViewAdditionalInvoicePreImage}
        options={LNDViewAdditionalInvoicePreImage.navigationOptions(theme)}
      />
      <WalletsStack.Screen name="Broadcast" component={Broadcast} options={Broadcast.navigationOptions(theme)} />
      <WalletsStack.Screen name="IsItMyAddress" component={IsItMyAddress} options={IsItMyAddress.navigationOptions(theme)} />
      <WalletsStack.Screen name="LnurlPay" component={LnurlPay} options={LnurlPay.navigationOptions(theme)} />
      <WalletsStack.Screen name="LnurlPaySuccess" component={LnurlPaySuccess} options={LnurlPaySuccess.navigationOptions(theme)} />
      <WalletsStack.Screen name="LnurlAuth" component={LnurlAuth} options={LnurlAuth.navigationOptions(theme)} />
      <WalletsStack.Screen
        name="Success"
        component={Success}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <WalletsStack.Screen name="WalletAddresses" component={WalletAddresses} options={WalletAddresses.navigationOptions(theme)} />
    </WalletsStack.Navigator>
  );
};

const BackupSeedStack = createNativeStackNavigator();
const BackupSeedRoot = () => {
  const theme = useTheme();
  return (
    <BackupSeedStack.Navigator screenOptions={{ headerShadowVisible: false }}>
      <BackupSeedStack.Screen name="BackupExplanation" component={BackupExplanation} options={BackupExplanation.navigationOptions(theme)} />
      <BackupSeedStack.Screen name="PleaseBackup" component={PleaseBackup} options={PleaseBackup.navigationOptions(theme)} />
    </BackupSeedStack.Navigator>
  );
};

const AddWalletStack = createNativeStackNavigator();
const AddWalletRoot = () => {
  const theme = useTheme();

  return (
    <AddWalletStack.Navigator screenOptions={{ headerShadowVisible: false }}>
      <AddWalletStack.Screen name="AddWallet" component={AddWallet} options={AddWallet.navigationOptions(theme)} />
      <AddWalletStack.Screen name="ImportWallet" component={ImportWallet} options={ImportWallet.navigationOptions(theme)} />
      <AddWalletStack.Screen
        name="ImportWalletDiscovery"
        component={ImportWalletDiscovery}
        options={ImportWalletDiscovery.navigationOptions(theme)}
      />
      <AddWalletStack.Screen
        name="ImportCustomDerivationPath"
        component={ImportCustomDerivationPath}
        options={ImportCustomDerivationPath.navigationOptions(theme)}
      />
      <AddWalletStack.Screen name="ImportSpeed" component={ImportSpeed} options={ImportSpeed.navigationOptions(theme)} />
      <AddWalletStack.Screen name="PleaseBackup" component={PleaseBackup} options={PleaseBackup.navigationOptions(theme)} />
      <AddWalletStack.Screen
        name="PleaseBackupLNDHub"
        component={PleaseBackupLNDHub}
        options={PleaseBackupLNDHub.navigationOptions(theme)}
      />
      <AddWalletStack.Screen name="PleaseBackupLdk" component={PleaseBackupLdk} options={PleaseBackupLdk.navigationOptions(theme)} />
      <AddWalletStack.Screen name="ProvideEntropy" component={ProvideEntropy} options={ProvideEntropy.navigationOptions(theme)} />
      <AddWalletStack.Screen
        name="WalletsAddMultisigHelp"
        component={WalletsAddMultisigHelp}
        options={WalletsAddMultisigHelp.navigationOptions(theme)}
      />
    </AddWalletStack.Navigator>
  );
};

// CreateTransactionStackNavigator === SendDetailsStack
const SendDetailsStack = createNativeStackNavigator();
const SendDetailsRoot = () => {
  const theme = useTheme();

  return (
    <SendDetailsStack.Navigator screenOptions={{ headerShadowVisible: false }}>
      <SendDetailsStack.Screen name="SendDetails" component={SendDetails} options={SendDetails.navigationOptions(theme)} />
      <SendDetailsStack.Screen name="Confirm" component={Confirm} options={Confirm.navigationOptions(theme)} />
      <SendDetailsStack.Screen
        name="PsbtWithHardwareWallet"
        component={PsbtWithHardwareWallet}
        options={PsbtWithHardwareWallet.navigationOptions(theme)}
      />
      <SendDetailsStack.Screen name="CreateTransaction" component={SendCreate} options={SendCreate.navigationOptions(theme)} />
      <SendDetailsStack.Screen name="PsbtMultisig" component={PsbtMultisig} options={PsbtMultisig.navigationOptions(theme)} />
      <SendDetailsStack.Screen
        name="PsbtMultisigQRCode"
        component={PsbtMultisigQRCode}
        options={PsbtMultisigQRCode.navigationOptions(theme)}
      />
      <SendDetailsStack.Screen
        name="Success"
        component={Success}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <SendDetailsStack.Screen name="SelectWallet" component={SelectWallet} options={SelectWallet.navigationOptions(theme)} />
      <SendDetailsStack.Screen name="CoinControl" component={CoinControl} options={CoinControl.navigationOptions(theme)} />
      <SendDetailsStack.Screen name="ScanLndInvoice" component={ScanLndInvoice} options={ScanLndInvoice.navigationOptions(theme)} />
      <SendDetailsStack.Screen name="LnurlPay" component={LnurlPay} options={LnurlPay.navigationOptions(theme)} />
      <SendDetailsStack.Screen name="LnurlPaySuccess" component={LnurlPaySuccess} options={LnurlPaySuccess.navigationOptions(theme)} />
    </SendDetailsStack.Navigator>
  );
};

const LDKOpenChannelStack = createNativeStackNavigator();
const LDKOpenChannelRoot = () => {
  const theme = useTheme();

  return (
    <LDKOpenChannelStack.Navigator name="LDKOpenChannelRoot" screenOptions={{ headerShadowVisible: false }} initialRouteName="SelectWallet">
      <LDKOpenChannelStack.Screen name="SelectWallet" component={SelectWallet} options={SelectWallet.navigationOptions(theme)} />
      <LDKOpenChannelStack.Screen
        name="LDKOpenChannelSetAmount"
        component={LdkOpenChannel}
        options={LdkOpenChannel.navigationOptions(theme)}
      />
      <LDKOpenChannelStack.Screen name="Success" component={Success} options={{ headerShown: false, gestureEnabled: false }} />
    </LDKOpenChannelStack.Navigator>
  );
};

const AztecoRedeemStack = createNativeStackNavigator();
const AztecoRedeemRoot = () => {
  const theme = useTheme();

  return (
    <AztecoRedeemStack.Navigator screenOptions={{ headerShadowVisible: false }}>
      <AztecoRedeemStack.Screen name="AztecoRedeem" component={AztecoRedeem} options={AztecoRedeem.navigationOptions(theme)} />
      <AztecoRedeemStack.Screen name="SelectWallet" component={SelectWallet} />
    </AztecoRedeemStack.Navigator>
  );
};

const ScanQRCodeStack = createNativeStackNavigator();
const ScanQRCodeRoot = () => (
  <ScanQRCodeStack.Navigator screenOptions={{ headerShown: false, presentation: isDesktop ? 'containedModal' : 'fullScreenModal' }}>
    <ScanQRCodeStack.Screen name="ScanQRCode" component={ScanQRCode} />
  </ScanQRCodeStack.Navigator>
);

const UnlockWithScreenStack = createNativeStackNavigator();
const UnlockWithScreenRoot = () => (
  <UnlockWithScreenStack.Navigator name="UnlockWithScreenRoot" screenOptions={{ headerShown: false }}>
    <UnlockWithScreenStack.Screen name="UnlockWithScreen" component={UnlockWith} initialParams={{ unlockOnComponentMount: true }} />
  </UnlockWithScreenStack.Navigator>
);

const ReorderWalletsStack = createNativeStackNavigator();
const ReorderWalletsStackRoot = () => {
  const theme = useTheme();

  return (
    <ReorderWalletsStack.Navigator name="ReorderWalletsRoot" screenOptions={{ headerShadowVisible: false }}>
      <ReorderWalletsStack.Screen name="ReorderWallets" component={ReorderWallets} options={ReorderWallets.navigationOptions(theme)} />
    </ReorderWalletsStack.Navigator>
  );
};

const ReceiveDetailsStack = createNativeStackNavigator();
const ReceiveDetailsStackRoot = () => {
  const theme = useTheme();

  return (
    <ReceiveDetailsStack.Navigator name="ReceiveDetailsRoot" screenOptions={{ headerShadowVisible: false }} initialRouteName="ReceiveDetails">
      <ReceiveDetailsStack.Screen name="ReceiveDetails" component={ReceiveDetails} options={ReceiveDetails.navigationOptions(theme)} />
      <ReceiveDetailsStack.Screen
        name="LNDCreateInvoice"
        component={LNDCreateInvoice}
        options={LNDCreateInvoice.navigationOptions(theme)}
      />
      <ReceiveDetailsStack.Screen
        name="LNDReceive"
        component={LNDReceive}
        options={LNDReceive.navigationOptions(theme)}
      />
      <ReceiveDetailsStack.Screen name="SelectWallet" component={SelectWallet} options={SelectWallet.navigationOptions(theme)} />
      <ReceiveDetailsStack.Screen name="LNDViewInvoice" component={LNDViewInvoice} options={LNDViewInvoice.navigationOptions(theme)} />
      <ReceiveDetailsStack.Screen
        name="LNDViewAdditionalInvoiceInformation"
        component={LNDViewAdditionalInvoiceInformation}
        options={LNDViewAdditionalInvoiceInformation.navigationOptions(theme)}
      />
      <ReceiveDetailsStack.Screen
        name="LNDViewAdditionalInvoicePreImage"
        component={LNDViewAdditionalInvoicePreImage}
        options={LNDViewAdditionalInvoicePreImage.navigationOptions(theme)}
      />
    </ReceiveDetailsStack.Navigator>
  );
};

const WalletXpubStack = createNativeStackNavigator();
const WalletXpubStackRoot = () => {
  const theme = useTheme();

  return (
    <WalletXpubStack.Navigator name="WalletXpubRoot" screenOptions={{ headerShadowVisible: false }} initialRouteName="WalletXpub">
      <WalletXpubStack.Screen name="WalletXpub" component={WalletXpub} options={WalletXpub.navigationOptions(theme)} />
    </WalletXpubStack.Navigator>
  );
};

const SignVerifyStack = createNativeStackNavigator();
const SignVerifyStackRoot = () => {
  const theme = useTheme();

  return (
    <SignVerifyStack.Navigator name="SignVerifyRoot" screenOptions={{ headerShadowVisible: false }} initialRouteName="SignVerify">
      <SignVerifyStack.Screen name="SignVerify" component={SignVerify} options={SignVerify.navigationOptions(theme)} />
    </SignVerifyStack.Navigator>
  );
};

const WalletExportStack = createNativeStackNavigator();
const WalletExportStackRoot = () => {
  const theme = useTheme();

  return (
    <WalletExportStack.Navigator name="WalletExportRoot" screenOptions={{ headerShadowVisible: false }} initialRouteName="WalletExport">
      <WalletExportStack.Screen name="WalletExport" component={WalletExport} options={WalletExport.navigationOptions(theme)} />
    </WalletExportStack.Navigator>
  );
};

const LappBrowserStack = createNativeStackNavigator();
const LappBrowserStackRoot = () => {
  const theme = useTheme();

  return (
    <LappBrowserStack.Navigator name="LappBrowserRoot" screenOptions={{ headerShadowVisible: false }} initialRouteName="LappBrowser">
      <LappBrowserStack.Screen name="LappBrowser" component={LappBrowser} options={LappBrowser.navigationOptions(theme)} />
    </LappBrowserStack.Navigator>
  );
};

const InitStack = createNativeStackNavigator();
const InitRoot = () => (
  <InitStack.Navigator initialRouteName="UnlockWithScreenRoot">
    <InitStack.Screen name="UnlockWithScreenRoot" component={UnlockWithScreenRoot} options={{ headerShown: false }} />
    <InitStack.Screen
      name="ReorderWallets"
      component={ReorderWalletsStackRoot}
      options={{ headerShown: false, gestureEnabled: false, presentation: isDesktop ? 'containedModal' : 'modal' }}
    />
    <InitStack.Screen name="Navigation" component={Navigation} options={{ headerShown: false, replaceAnimation: 'push' }} />
  </InitStack.Navigator>
);

const ViewEditMultisigCosignersStack = createNativeStackNavigator();
const ViewEditMultisigCosignersRoot = () => {
  const theme = useTheme();

  return (
    <ViewEditMultisigCosignersStack.Navigator
      name="ViewEditMultisigCosignersRoot"
      initialRouteName="ViewEditMultisigCosigners"
      screenOptions={{ headerShadowVisible: false }}
    >
      <ViewEditMultisigCosignersStack.Screen
        name="ViewEditMultisigCosigners"
        component={ViewEditMultisigCosigners}
        options={ViewEditMultisigCosigners.navigationOptions(theme)}
      />
    </ViewEditMultisigCosignersStack.Navigator>
  );
};

const ExportMultisigCoordinationSetupStack = createNativeStackNavigator();
const ExportMultisigCoordinationSetupRoot = () => {
  const theme = useTheme();

  return (
    <ExportMultisigCoordinationSetupStack.Navigator
      name="ExportMultisigCoordinationSetupRoot"
      initialRouteName="ExportMultisigCoordinationSetup"
      screenOptions={{ headerShadowVisible: false }}
    >
      <ExportMultisigCoordinationSetupStack.Screen
        name="ExportMultisigCoordinationSetup"
        component={ExportMultisigCoordinationSetup}
        options={ExportMultisigCoordinationSetup.navigationOptions(theme)}
      />
    </ExportMultisigCoordinationSetupStack.Navigator>
  );
};

const DeeplinkStack = createNativeStackNavigator();
const DeeplinkStackRoot = () => {
  const theme = useTheme();

  return (
    <DeeplinkStack.Navigator name="Deeplink" screenOptions={{ headerShadowVisible: false }} initialRouteName="Sell">
      <DeeplinkStack.Screen name="Sell" component={Sell} options={Sell.navigationOptions(theme)} />
      <DeeplinkStack.Screen name="Confirm" component={Confirm} options={Confirm.navigationOptions(theme)} />
      <DeeplinkStack.Screen name="CreateTransaction" component={SendCreate} options={SendCreate.navigationOptions(theme)} />
      <DeeplinkStack.Screen
        name="Success"
        component={Success}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <SendDetailsStack.Screen name="LnurlPay" component={LnurlPay} options={LnurlPay.navigationOptions(theme)} />
      <SendDetailsStack.Screen name="LnurlPaySuccess" component={LnurlPaySuccess} options={LnurlPaySuccess.navigationOptions(theme)} />
    </DeeplinkStack.Navigator>
  );
};

const PaymentCodeStack = createNativeStackNavigator();
const PaymentCodeStackRoot = () => {
  return (
    <PaymentCodeStack.Navigator name="PaymentCodeRoot" screenOptions={{ headerShadowVisible: false }} initialRouteName="PaymentCode">
      <PaymentCodeStack.Screen name="PaymentCode" component={PaymentCode} options={{ headerTitle: loc.bip47.payment_code }} />
      <PaymentCodeStack.Screen
        name="PaymentCodesList"
        component={PaymentCodesList}
        options={{ headerTitle: loc.bip47.payment_codes_list }}
      />
    </PaymentCodeStack.Navigator>
  );
};

const RootStack = createNativeStackNavigator();
const NavigationDefaultOptions = { headerShown: false, presentation: isDesktop ? 'containedModal' : 'modal' };
const Navigation = () => {
  const { wallets } = useContext(BlueStorageContext);
  return (
    <RootStack.Navigator
      initialRouteName={wallets.length === 0 ? 'AddWalletRoot' : 'WalletsRoot'}
      screenOptions={{ headerShadowVisible: false }}
    >
      {/* stacks */}
      <RootStack.Screen name="WalletsRoot" component={WalletsRoot} options={{ headerShown: false, translucent: false }} />
      <RootStack.Screen name="BackupSeedRoot" component={BackupSeedRoot} options={NavigationDefaultOptions} />
      <RootStack.Screen name="AddWalletRoot" component={AddWalletRoot} options={{ headerShown: false, translucent: false }} />
      <RootStack.Screen name="SendDetailsRoot" component={SendDetailsRoot} options={NavigationDefaultOptions} />
      <RootStack.Screen name="AztecoRedeemRoot" component={AztecoRedeemRoot} options={NavigationDefaultOptions} />
      {/* screens */}
      <RootStack.Screen name="WalletExportRoot" component={WalletExportStackRoot} options={NavigationDefaultOptions} />
      <RootStack.Screen
        name="ExportMultisigCoordinationSetupRoot"
        component={ExportMultisigCoordinationSetupRoot}
        options={NavigationDefaultOptions}
      />
      <RootStack.Screen name="ViewEditMultisigCosignersRoot" component={ViewEditMultisigCosignersRoot} options={NavigationDefaultOptions} />
      <RootStack.Screen name="WalletXpubRoot" component={WalletXpubStackRoot} options={NavigationDefaultOptions} />
      <RootStack.Screen name="SignVerifyRoot" component={SignVerifyStackRoot} options={NavigationDefaultOptions} />
      <RootStack.Screen name="SelectWallet" component={SelectWallet} />
      <RootStack.Screen name="ReceiveDetailsRoot" component={ReceiveDetailsStackRoot} options={NavigationDefaultOptions} />
      <RootStack.Screen name="LappBrowserRoot" component={LappBrowserStackRoot} options={NavigationDefaultOptions} />
      <RootStack.Screen name="LDKOpenChannelRoot" component={LDKOpenChannelRoot} options={NavigationDefaultOptions} />

      <RootStack.Screen
        name="ScanQRCodeRoot"
        component={ScanQRCodeRoot}
        options={{
          headerShown: false,
          presentation: isDesktop ? 'containedModal' : 'fullScreenModal',
        }}
      />

      <RootStack.Screen name="DeeplinkRoot" component={DeeplinkStackRoot} options={NavigationDefaultOptions} />
      <RootStack.Screen name="PaymentCodeRoot" component={PaymentCodeStackRoot} options={NavigationDefaultOptions} />
    </RootStack.Navigator>
  );
};

export default InitRoot;
