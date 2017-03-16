module.exports = {
  currency: (new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  })).format,
  percent: value => {
    return (value >= 0 ? '+' : '') + value + '%';
  }
};
