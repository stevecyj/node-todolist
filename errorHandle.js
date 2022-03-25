const headers = require('./headers');

// 自訂 error 分類
const errorCategories = {
  400: {
    40001: '資料不是 JSON 格式',
    40002: '資料沒有 title 欄位',
    40003: 'id 不存在',
  },
  401: '拒絕存取',
  404: '找不到資源',
};

function errorHandle(res, statusCode, errorCode) {
  let errorMessage = '';
  if (statusCode) {
    errorMessage = errorCategories[statusCode];
  }
  if (statusCode && errorCode) {
    errorMessage = errorCategories[statusCode][errorCode];
  }

  let data = {
    status: 'false',
    message: errorMessage,
  };

  res.writeHead(statusCode, headers);
  res.write(JSON.stringify(data));
  res.end();
}

module.exports = errorHandle;
