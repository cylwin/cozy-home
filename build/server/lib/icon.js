// Generated by CoffeeScript 1.8.0
var fs, icons, path;

fs = require('fs');

path = require('path');

module.exports = icons = {};


/*
Get right icon path depending on app configuration:
* returns root folder + path mentioned in the manifest file if path is in the
  manifest.
* returns svg path if svg icon exists in the app folder.
* returns png path if png icon exists in the app folder.
* returns null otherwise
 */

icons.getPath = function(root, appli) {
  var basePath, extension, iconName, iconPath, pngPath, result, svgPath;
  iconPath = path.join(root, appli.iconPath);
  if ((appli.iconPath == null) || !fs.existsSync(iconPath)) {
    basePath = path.join(root, "client", "app", "assets", "icons");
    svgPath = path.join(basePath, "main_icon.svg");
    pngPath = path.join(basePath, "main_icon.png");
    if (fs.existsSync(svgPath)) {
      iconPath = svgPath;
    } else if (fs.existsSync(pngPath)) {
      iconPath = pngPath;
    } else {
      iconPath = null;
    }
  }
  if (iconPath == null) {
    return null;
  } else {
    extension = iconPath.indexOf('.svg') !== -1 ? 'svg' : 'png';
    iconName = "icon." + extension;
    result = {
      path: iconPath,
      name: iconName
    };
    return result;
  }
};

icons.save = function(appli, callback) {
  var basePath, iconInfos, name, repoName, root;
  if (callback == null) {
    callback = function() {};
  }
  if (appli != null) {
    repoName = (appli.git.split('/')[4]).replace('.git', '');
    name = appli.name.toLowerCase();
    basePath = '/' + path.join('usr', 'local', 'cozy', 'apps');
    root = path.join(basePath, name, name, repoName);
    iconInfos = icons.getPath(root, appli);
    if (iconInfos == null) {
      root = path.join(basePath, name);
      iconInfos = icons.getPath(root, appli);
    }
    if (iconInfos != null) {
      return appli.attachFile(iconInfos.path, {
        name: iconInfos.name
      }, function(err) {
        if (err) {
          return callback(err);
        } else {
          return callback();
        }
      });
    } else {
      return callback(new Error("Icon not found"));
    }
  } else {
    return callback(new Error('Appli cannot be reached'));
  }
};
