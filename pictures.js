//
// Pictures
//
// This module stores collections of pictures, called "albums".
// Each folder at the root of the module is treated as an album,
// unless it starts with a dollar sign ($)
//

RemoteStorage.defineModule('pictures', function(privateClient, publicClient) {

  var isDir = remoteStorage.util.isDir;

  AlbumMethods = {

    // Store image with given MIME type under the given name.
    // The given `data` is expected to be an `ArrayBuffer`.
    //
    // Returns a promise, which will be fulfilled with the
    // absolute URL of the newly uploaded picture.
    // See `getPictureURL` for details.
    store: function(mimeType, fileName, data) {
      return this.storeFile(mimeType, fileName, data).then(function() {
        return this.getPictureURL(fileName);
      }.bind(this));
    },

    // Get a list of all pictures in this album.
    list: function() {
      return this.getListing('').then(function(listing) {
          return listing.map(decodeURIComponent);
        });
    },

    // Get the absolute URL for the picture with the given `fileName`.
    // Useful for displaying a public picture using the `src` attribute
    // of an `<img>` element.
    getPictureURL: function(fileName) {
      return this.getItemURL(fileName);
    },

    open: function() {
      this.cache('');
    },

    close: function() {
      this.cache('', false);
      return this;
    }

  };

  function filterAlbumListing(listing) {
    var albums = [];
    listing.forEach(function(item) {
      if(isDir(item) && item[0] !== '$') {
        albums.push(item.replace(/\/$/, '')); // strip trailing slash.
      }
    });
    return albums;
  }

  var pictures = {

    init: function() {
      privateClient.release('');
      publicClient.release('');
    },

    getUuid: privateClient.uuid,

    // Open album with given `name`. This will sync the list of images
    // and make them accessible via the returned `Album` object.
    openPublicAlbum: function(name) {
      return publicClient.scope(name + '/').extend(albumMethods).open();
    },

    listPublicAlbums: function() {
      return publicClient.getListing('').then(filterAlbumListing);
    },

    openPrivateAlbum: function(name) {
      return privateClient.scope(name, '/').extend(albumMethods).open();
    },

    listPrivateAlbums: function() {
      return privateClient.getListing('').then(filterAlbumListing);
    }

  };

  return {
    exports: pictures
  };

});
