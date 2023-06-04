const jwt = require('jsonwebtoken');
const md5 = require('md5');
const path = require('path');
const multer = require('multer');
const toc = require('markdown-toc');

// 格式化要响应的数据
// {
//     "code" : code,
//     "msg" : "",
//     "data" : data
// }
module.exports.formatResponse = function (code, msg, data) {
  return {
    code: code,
    msg: msg,
    data: data,
  };
};

module.exports.analysisToken = function (token) {
  return jwt.verify(token.split(' ')[1], md5(process.env.JWT_SECRET));
};

// 处理数组类型的响应数据
module.exports.handleDataPattern = function (data) {
  const arr = [];
  for (const i of data) {
    arr.push(i.dataValues);
  }
  return arr;
};

//设置上传文件引擎
const storage = multer.diskStorage({
  // 文件存储的位置
  destination: function (req, file, cb) {
    cb(null, __dirname + '/../public/static/uploads');
  },
  // 上传服务器的文件 文件名要做单独处理
  filename: function (req, file, cb) {
    // 获取文件名
    const basename = path.basename(
      file.originalname,
      path.extname(file.originalname)
    );
    // 获取后缀名
    const extname = path.extname(file.originalname);
    // 构建新的名字
    const newName =
      basename +
      new Date().getTime() +
      Math.floor(Math.random() * 9000 + 1000) +
      extname;
    cb(null, newName);
  },
});

module.exports.uploading = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 2, files: 1 },
});

// 处理 TOC
module.exports.handleTOC = function (info) {
  let result = toc(info.htmlContent).json;
  console.log(result);

  function transfer(flatArr) {
    const stack = [];
    const result = [];

    function createTOCtem(item) {
      return {
        name: item.content,
        anchor: item.slug,
        level: item.lvl,
        children: [],
      };
    }

    function handleItem(item) {
      // 获取 stack 栈顶的元素，也就是该数组的最后一个元素
      // 如果该数组为空，得到的是一个 undefined
      const top = stack[stack.length - 1];
      if (!top) {
      }
    }

    // 最小级别标题
    const min = 6;
    // 该 for 循环用于寻找当前数组中最小的标题等级
    for (const i of flatArr) {
      if (i.lvl < min) {
        min = i.lvl;
      }
    }
    for (const item of flatArr) {
      const tocItem = createTOCtem(item);
      if (tocItem.level === min) {
        // 如果进入此 if，说明当前的 toc 对象已经是最低的等级，不会作为其他对象的 children
        result.push(tocItem);
      }
      // 如果没有进入上面的 if，说明该 toc 对象不是最低等级，可能是其他 toc 对象 children 数组里面的一员
      handleItem(tocItem);
    }
  }
  info.toc = transfer(result);
};
