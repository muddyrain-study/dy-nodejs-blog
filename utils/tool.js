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
  let result = toc(info.markdownContent).json;

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
        stack.push(item);
      } else if (item.level > top.level) {
        // 进入此分支，说明当前的 toc 对象的等级比栈顶（之前的上一个）要大
        // 说明当前这个 toc 对象应该成为上一个 toc 对象的子元素
        top.children.push(item);
        stack.push(item);
      } else {
        stack.pop();
        handleItem(item);
      }
    }

    // 最小级别标题
    let min = 6;
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

    return result;
  }
  info.toc = transfer(result);
  delete info.markdownContent;
  // 接下来再为各个级别的标题添加上 id
  for (const i of result) {
    switch (i.lvl) {
      case 1: {
        var newStr = `<h1 id="${i.slug}">`;
        info.htmlContent = info.htmlContent.replace('<h1>', newStr);
        break;
      }
      case 2: {
        var newStr = `<h2 id="${i.slug}">`;
        info.htmlContent = info.htmlContent.replace('<h2>', newStr);
        break;
      }
      case 3: {
        var newStr = `<h3 id="${i.slug}">`;
        info.htmlContent = info.htmlContent.replace('<h3>', newStr);
        break;
      }
      case 4: {
        var newStr = `<h4 id="${i.slug}">`;
        info.htmlContent = info.htmlContent.replace('<h4>', newStr);
        break;
      }
      case 5: {
        var newStr = `<h5 id="${i.slug}">`;
        info.htmlContent = info.htmlContent.replace('<h5>', newStr);
        break;
      }
      case 6: {
        var newStr = `<h6 id="${i.slug}">`;
        info.htmlContent = info.htmlContent.replace('<h6>', newStr);
        break;
      }
    }
  }

  return info;
};
