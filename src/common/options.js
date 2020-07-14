const OPTIONS = {
  LOAN_CARD_AUDIT: {
    header: {
      label: '提交审核时间',
      value: 'commitReviewTime'
    },
    body: [{
      label: '借款人',
      value: 'borrowerName'
    }, {
      label: '申请借款金额(元)',
      value: 'borrowAmount',
      type: 'amount'
    }],
    footer: {
      label: '进件编号：',
      value: 'rootApplyId'
    }
  },
  LOAN_CARD_SUCCESS: {
    type: 'success',
    header: {
      label: '放款金额(元)',
      value: 'lendingAmount',
      type: 'amount'
    },
    body: [{
      label: '审批借款金额(元)',
      value: 'amountFixed'
    }, {
      label: '借款人',
      value: 'borrowerName'
    }, {
      label: '申请借款金额(元)',
      value: 'borrowAmount'
    }, {
      label: '提交审核时间',
      value: 'commitReviewTime'
    }],
    footer: {
      label: '进件编号：',
      value: 'rootApplyId'
    }
  },
  LOAN_CARD_FAILURE: {
    type: 'failure',
    header: {
      label: '提交审核时间',
      value: 'commitReviewTime'
    },
    body: [{
      label: '借款人',
      value: 'borrowerName'
    }, {
      label: '申请借款金额(元)',
      value: 'borrowAmount',
      type: 'amount'
    }],
    footer: {
      label: '进件编号：',
      value: 'rootApplyId'
    }
  },
  ESTIMATE_CARD: {
    header: {
      label: '评估时间',
      value: 'queryTime',
      filter: 'datetime'
    },
    body: [{
      label: '客户姓名',
      value: 'name'
    }, {
      label: '评估结果',
      value: 'result'
    }]
  }
}

export default OPTIONS
