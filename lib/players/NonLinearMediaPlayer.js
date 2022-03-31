'use strict';

var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;
var VPAID_EVENTS = require('../enums/VPAID_EVENTS');

function on(media, event, handler) {
    return media.addEventListener(event, handler, false);
}

function off(media, event, handler) {
    return media.removeEventListener(event, handler, false);
}

function once(media, event, handler) {
    return on(media, event, function onevent() {
        off(media, event, onevent);
        return handler.apply(this, arguments);
    });
}

function pickMediaFile(mediaFiles, dimensions) {
    var width = dimensions.width;
    var items = mediaFiles.map(function (mediaFile) {
        return {
            mediaFile: mediaFile,
            type: mediaFile.resources[0].type
        };
    });
    var distances = items.map(function (item) {
        return Math.abs(width - item.mediaFile.width);
    });
    var item = items[distances.indexOf(Math.min.apply(Math, distances))];
    return !item ? null : item.mediaFile;
}

function NonLinearMediaPlayer(container, adContainer) {
    this.container = container;
    this.adContainer = adContainer;
    this.media = null;

}

inherits(NonLinearMediaPlayer, EventEmitter);

NonLinearMediaPlayer.prototype.load = function load(media) {
    var self = this;

    return new Promise(function loadMedia(resolve, reject) {
        var pickedMedia = pickMediaFile(media, self.adContainer.getBoundingClientRect())
        if(!pickedMedia) {
           return reject(new Error("No media to pick from..."));
        }

        self.media = pickedMedia;
        resolve(self);

    })
}

module.exports = NonLinearMediaPlayer;