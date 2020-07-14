export default {
  username: state => state.identity
    ? state.identity.name || state.identity.mobile : '',
  accountId: state => state.identity && state.identity.accountId
    ? state.identity.accountId : '',
  mobile: state => state.identity && state.identity.mobile
    ? state.identity.mobile : '',
  headImgUrl: state => state.identity
    ? state.identity.headImgUrl : '',
  bankCardCount: state => state.identity ? state.identity.bankCardCount : 0,
  hasIdentity: state => state.identity !== null,
  isSeller: state => state.identity && state.identity.userType === 1,
  hasAuthenticate: state => state.identity && state.identity.isVerifiedUser,
  customerCreateBased: state => state.customerInfo && state.customerInfo.based,
  customerCreateRecord: state => state.customerInfo && state.customerInfo.record,
  customerCreateImages: state => state.customerInfo && state.customerInfo.imageList
}
