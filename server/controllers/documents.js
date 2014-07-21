var mongoose = require('mongoose');
var fs = require("fs");
var zipfile = require('zipfile');
var cheerio = require('cheerio');
var cleanCSS = require('clean-css');


var Document = mongoose.model('Document', require('../models/document')); 
var Files = mongoose.model('Files', require('../models/files'));
var Clip = mongoose.model('Selection', require('../models/selection'));

exports.show = function(req, res, next){
  Document.findOne({_id: req.params.id},function(err, result){
    if(err){
      console.error(err);
    }
//    results.files = [];
    return res.send(result);
  });
}

exports.clips = function(req, res, next){
  Clip.find({documentId: req.params.id}, function(err, result){
    if(err)
      throw err;
    return res.send(result);
  });
}

exports.files = function(req, res, next){
  Files.findOne({docId: req.params.id},function(err, result){
    if(err)
      console.log(err);

    return res.send(result === null?"":result);
  });
};

exports.getContent = function(req, res, next){
  Files.findOne({docId: req.params.id},function(err, result){
    if(err)
      console.log(err);

    return res.send(result === null?"":result.contents[req.params.documentFragement].data);
  });
}

exports.getStyle = function(req, res, next){
  Files.findOne({docId: req.params.id},function(err, result){
    if(err)
      console.log(err);
    return res.send(result === null?"":result.style.data);
  });
};

exports.getImage = function(req, res, next){
//  res.setHeader('content-type', 'application/binary');
  Files.findOne({docId: req.params.id}, function(err, result){
    if(err)
      console.log(err);
    return res.send(result === null?"":result.images[req.params.imageId].data);
  });
};

exports.file = function(req, res, next){
  Document.findOne({_id: req.params.id}, function(err, result){
    if(err){
      console.error(err);
    }

    for(var i = 0;i<result.files.length;i++){
      if(result.files[i].name === req.params.filename){
        return res.send(result.files[i].data);
      }
    }

  });

}

exports.index = function(req, res){

  var perPage = 10;
  var page = req.params.page > 0 ? req.params.page : 0;

  Document.find()
    .limit(perPage)
    .skip(perPage * page)
    .exec(function(err, results){
    if(err){

    }
    return res.send(results);
  });
  
};

exports.clear = function(req, res){
  Document.remove({}, function(err){
    if(err)
      throw err;
  });

  Files.remove({}, function(err){
    if(err)
      throw err;
  });

  return res.send();
};


exports.destroy = function(req, res, next){

  return res.send();
}

exports.create = function(req, res, next){
  try{
  var path = req.files.files.path;

  var files = [];
  var doc = new Document();
  var zf = new zipfile.ZipFile(path);
  var doc;
  var navMap;
  for(var i = 0;i<zf.count;i++){
    var buffer = zf.readFileSync(zf.names[i]);
    //create all of the spine metadata etc.
    if(zf.names[i].indexOf('opf') != -1){
      doc = createFromOPF(buffer.toString());
    }else if(zf.names[i].indexOf('ncx') != -1){
      navMap = createFromNCX(buffer.toString());
    }else {
      //push all of the binary to the files
      var filename = zf.names[i].split("/"); 
      var file = {};
      filename = filename[filename.length-1];
      file.name = filename;
      if(file.name.indexOf('.htm') != -1){
        file.data = buffer.toString();
      }else if(file.name.indexOf('.jpeg') != -1||file.name.indexOf('.jpg') != -1){
        file.data = buffer.toString('base64');
      //  console.log(file.data);
      }else{ 
        file.data = buffer;
      }

      files.push(file);
    }
  }
  doc.navMap = navMap;
  console.log("Number of files ", files.length);


  //if document actually exists assign the files binary to it
  var tmp = {};
  var firstNavMap = doc.navMap[0].link.split("#");
  var navMapHref = firstNavMap[0];
  var firstId = firstNavMap[1];
  for(var i = 0;i<doc.manifest.length;i++){
    var href = doc.manifest[i].href;
    var id = doc.manifest[i].id;
    var index = 0;
    for(var j = 0;j<files.length;j++){
      console.log(href, files[j].name);
      if(href === files[j].name){
        var fileParts = files[j].name.split("."); 
        var fileEx = fileParts[fileParts.length-1];
        //console.log(files[j].name);
        if(fileEx.indexOf("htm") != -1){
          var $ = cheerio.load(files[j].data);
          tmp[id] = {};

          var children = [];
          if($("#"+firstId).text().length != 0){
            children = $("#"+firstId).prev().nextAll();
          }else{
            children = $("body").children();
          }

          for(var k = 0;k<children.length;k++){
            $(children[k]).attr("data-index",index++);
          }
          tmp[id].data = $("body").html();
          tmp[id].name = files[j].name;
        }else{
          tmp[id] = files[j];
        }
        break;
      }
    }
  }

  doc.save(function(err,sDoc){
    if(err)
      console.log(err);
    createFiles(tmp,sDoc);
  });

  res.send();
  }catch(err){
    console.log(err);
  }

  return next();
}


function createFiles(tmpFiles, doc){
  var files = new Files();
  files.contents = {};
  files.images = {};
  files.style = {};

  tmpFiles = concatDocumentCSS(tmpFiles, doc);

  for(var i = 0;i<doc.manifest.length;i++){
    var id = doc.manifest[i].id;
    if(doc.manifest[i].mediaType === "text/css"){
      files.style = tmpFiles[id];
    }else if(doc.manifest[i].mediaType === "application/xhtml+xml"){
      files.contents[id] = tmpFiles[id];
    }else if(doc.manifest[i].mediaType === "image/jpeg"){
      files.images[id] = tmpFiles[id];
      console.log("saving File-----------------",tmpFiles[id]);
    }
  }
  files.docId = doc.id;

  files.save(function(err, sFiles){
    if(err)
      console.log(err);
  });
}

function concatDocumentCSS(files, doc){
  var styles = "";
  var newManifest = [];

  for(var i = 0;i<doc.manifest.length;i++){
    if(doc.manifest[i].mediaType === "text/css"){
      styles += files[doc.manifest[i].id].data;
      delete files[doc.manifest[i].id];
    }else{
      newManifest.push(doc.manifest[i]);
    }
  }
  //switch to newly created manifest.
  var minCss = new cleanCSS().minify(styles);
  minCss = minCss.replace(/width\:\d+[a-z]+;?/gi,"")
     .replace(/margin-left:\d%;?/gi,"")
     .replace(/margin-right:\d%;?/gi,"")
     .replace(/text-indent:-.+;?/gi,"");

  files["style"] = {};

  // set and match
  files["style"].data = minCss;
  files["style"].name = "style.css";
  newManifest.push({ "href": "style.css", "id": "style", "mediaType": "text/css"});
  doc.manifest = newManifest;
  doc.save();
  return files;
}

function createFromNCX(ncx){
  var $ = cheerio.load(ncx, { xmlMode: true, lowerCaseTags: true });
  return createNavMap($('navmap'));
}

function createFromOPF(opf){
  var $ = cheerio.load(opf, { xmlMode: true });
  var doc= new Document();
  try{
    doc.spine = createSpine($('spine'));
    doc.manifest = createManifest($('manifest'));
    doc.metadata = createMetadata($('metadata'));
    doc.guide = createGuide($('guide'));
    return doc;

  }catch(err){
    console.log(err);
  }
}

function createNavMap(navmap){
  var point = navmap.children().first();
  var points = [];
  while(point.html() !== null){
    points.push(createNavPoint(point)); 
    point = point.next();
  }
  return points;
}

function createNavPoint(point){
  var data = {};
  var pnt = point.children().first();
  data.id = point[0].attribs.id;
  data.playOrder = point[0].attribs.playOrder;

  while(pnt.html() !== null){
    var name = pnt[0].name;
    if(name === "navlabel"){
      data.navLabel = pnt.text().replace(/^(\s*)|(\s*)$/g, '').replace(/\s+/g, ' ');
    }else if(name === "content"){
      data.link = pnt.attr("src");
    }else if(name === "navpoint"){
      data.navPoint = createNavPoint(pnt); 
    }
    pnt = pnt.next();
  }

  return data;
}

function createMetadata(metadata){
  var data = metadata.children().first();
  var datums = {};
  while(data.html() !== null){
    datums[data[0].name] = data.html();
    data = data.next();
  }
  return datums;
}

function createSpine(spine){
  var itemref = spine.children().first();
  var itemrefs = [];
  while(itemref.html() !== null){
    var tmp = {};
    tmp.idref = itemref.attr("idref");
    tmp.linear = itemref.attr("linear");
    itemrefs.push(tmp);
    itemref = itemref.next();
  }
  return itemrefs;
}

function createManifest(manifest){
  var item = manifest.children().first();
  var items = [];
  while(item.html() !== null){
    var tmp = {};
    tmp.href = item.attr("href");
    tmp.id = item.attr("id");
    tmp.mediaType = item.attr("media-type");
    items.push(tmp);
    item = item.next();
  }
  return items;
}

function createGuide(guide){
  var reference = guide.children().first();
  var references = [];
  while(reference.html() !== null){
    var tmp = {};
    tmp.href = reference.attr("href");
    tmp.type = reference.attr("type");
    tmp.title = reference.attr("title");
    references.push(tmp);
    reference = reference.next();
  }
  return references;
}
