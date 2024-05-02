// import ImagePicker from 'react-native-image-crop-picker';
// import RNGooglePlaces from 'react-native-google-places';
// import Geocoder from "react-native-geocoder";
import {
  checkMultiple,
  request,
  requestMultiple,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import { DeviceEventEmitter } from 'react-native';

export const validatePhoneNumber = (number) => {
  const regex =/^[0]?[6789]\d{9}$/;
  return regex.test(number);
}

export const validateEmail = (email) => {
  var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(String(email));
}

export const humanizedNumber = (number, decimals, recursiveCall) => {
  const decimalPoints = decimals || 2;
  const noOfLakhs = number / 100000;
  let displayStr;
  let isPlural;

  // Rounds off digits to decimalPoints decimal places
  function roundOf(integer) {
    return +integer.toFixed(decimalPoints);
  }

  if (noOfLakhs >= 1 && noOfLakhs <= 99) {
    const lakhs = roundOf(noOfLakhs);
    isPlural = lakhs > 1 && !recursiveCall;
    displayStr = `${lakhs} Lakh${isPlural ? 's' : ''}`;
  } else if (noOfLakhs >= 100) {
    const crores = roundOf(noOfLakhs / 100);
    const crorePrefix = crores >= 100000 ? humanizedNumber(crores, decimals, true) : crores;
    isPlural = crores > 1 && !recursiveCall;
    displayStr = `${crorePrefix} Crore${isPlural ? 's' : ''}`;
  } else {
    displayStr = roundOf(+number);
  }

  return displayStr;
}

// export const selectImagesFromGallery = (callback, options) => {
//   options = options ? options : {
//     title: 'Image',
//     width: 1000,
//     height: 500,
//     compressImageQuality: 0.5,
//     multiple: true,
//     includeBase64: true,
//     storageOptions: {
//       skipBackup: true,
//       path: 'images',
//     },
//   };

//   let images = [];

//   ImagePicker.openPicker(options).then(response => {

//     if (response.didCancel) {
//       console.log('User cancelled image picker');
//     } else if (response.error) {
//       console.log('ImagePicker Error: ', response.error);
//     } else if (response.customButton) {
//       console.log('User tapped custom button: ', response.customButton);
//     } else {
//       // const source = { uri: 'data:image/png;base64,' + response.data };
//       images = response.map(image => {
//         return {
//           uniqueId: Date.now().toString(36) + Math.random().toString(36).substring(2),
//           mime: image.mime,
//           logo: { uri: 'data:image/png;base64,' + image.data },
//           fileName: `${(image?.path || '').substring((image?.path || '').lastIndexOf('/') + 1)}-${new Date().getTime()}`,
//         };
//       });
//       if (callback) {
//         callback(images);
//       }
//       return images;
//     }
//   });

//   return images;
// }

// export const openCamera = (callback, options) => {
//   options = options ? options : {
//     title: 'Image',
//     width: 500,
//     height: 500,
//     compressImageQuality: 0.5,
//     includeBase64: true,
//     mediaType: 'photo',
//     cropping: true,
//     storageOptions: {
//       skipBackup: true,
//       path: 'images',
//     },
//   };

//   let images = [];

//   ImagePicker.openCamera(options).then(response => {

//     if (response.didCancel) {
//       console.log('User cancelled image picker');
//     } else if (response.error) {
//       console.log('ImagePicker Error: ', response.error);
//     } else if (response.customButton) {
//       console.log('User tapped custom button: ', response.customButton);
//     } else {
//       // const source = { uri: 'data:image/png;base64,' + response.data };
//       images.push({
//         uniqueId: Date.now().toString(36) + Math.random().toString(36).substring(2),
//         mime: response.mime,
//         logo: { uri: 'data:image/png;base64,' + response.data },
//         fileName: `${(response.path || '').substring((response.path || '').lastIndexOf('/') + 1)}`,
//       });
//       if (callback) {
//         callback(images);
//       }
//       return images;
//     }
//   });

//   return images;
// }


export const checkLocationPermissions = (callback) => {
  LocationServicesDialogBox.checkLocationServicesIsEnabled({
    message: "<h2>Use Location ?</h2>This app wants to change your device settings:<br/><br/>Use GPS, Wi-Fi, and cell network for location<br/><br/>",
    ok: "YES",
    cancel: "NO",
    enableHighAccuracy: true,
    showDialog: true,
    openLocationServices: true,
    preventOutSideTouch: true,
    preventBackClick: true,
    providerListener: true,
  }).then(function (success) {
    // success => {alreadyEnabled: true, enabled: true, status: "enabled"} 
    if (success.enabled) {
      setTimeout(() => {
        setCurrentLocation(callback);
      }, 1000);
    } else {
      checkLocationPermissions(callback);
    }
  }.bind(this)
  ).catch((error) => {
    console.log('location permission error', error.message);
    checkLocationPermissions(callback);
  });

  DeviceEventEmitter.addListener('locationProviderStatusChange', function (status) { // only trigger when "providerListener" is enabled
    console.log(status);
  });
};

export const setCurrentLocation = async (callback) => {
  const iosPermissions = [
    PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    PERMISSIONS.IOS.LOCATION_ALWAYS];

  const androidPermissions = [
    PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
  ];

  const permissions = Platform.OS === 'ios' ? iosPermissions : androidPermissions;

  checkMultiple(permissions).then((statuses) => {
    console.log('STATUSES', statuses)
    if (statuses[permissions[0]] === 'granted' || statuses[permissions[1]] === 'granted') {
      // getCurrentLocation(callback);
    }
  }).then(e => {
    requestMultiple(permissions).then(statuses => {
      if (statuses[permissions[0]] === 'granted' || statuses[permissions[1]] === 'granted') {
        // getCurrentLocation(callback);
      }
    });
    console.log('EXCEPTION----------------->', e)
  });
}

export const getCurrentLocation = async (callback) => {
  // RNGooglePlaces.getCurrentPlace()
  //   .then(async (results) => {
  //     const location = results[0].location;
  //     let result = await Geocoder.geocodePosition({ lat: location.latitude, lng: location.longitude });
  //     const locationName = result[0].formattedAddress ? result[0].formattedAddress.split(',') : '';
  //     const name = locationName.length > 0 ? `${locationName[0]} ${locationName[1] ? `,${locationName[1]}` : ''}` : result[0].subLocality || '';
  //     console.log('location--------------------->', name, locationName, result[0]);
  //     callback(results[0]);
  //   }).catch((error) => console.log('e--------', error));
}