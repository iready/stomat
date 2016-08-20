function createYandexMap(mainId, options, showCityMap) {
    var mainZoom    = options.mainZoom || 11;
    var mainCoords  = options.mainCoords || [54.5937,41.6524];
    var mainIcon    = options.mainIcon;
    var cityArray   = options.cityArray;
    var cityZoom    = options.cityZoom || 13;
    var companyName = options.companyName || "";

    var cityMap     = [];
    var i = 1;
    var mapState = 'general';

    var placemarkOption = {
                iconLayout: 'default#imageWithContent',
                iconImageHref: mainIcon,
                hideIconOnBalloonOpen: false,
                iconImageOffset: [-20, 1],
                iconImageSize: [70, 41]
            }

    if (showCityMap) {      
        var branchOption = {
                    iconLayout: 'default#imageWithContent',
                    iconImageHref: options.cityOptions.icon,
                    iconImageOffset: [-20, 1],
                    iconImageSize: [70, 41],
                    hideIconOnBalloonOpen: false
                }
    }

    ymaps.ready(init);

    function init() {
        mainMap = new ymaps.Map (mainId, {
            center: mainCoords,
            zoom: mainZoom,
            controls: ['zoomControl'] 
        });
        mainMap.behaviors.disable('scrollZoom');
        cityCollection = new ymaps.GeoObjectCollection;

        cityArray.forEach(findAndCreatePlacemark);
        mainMap.geoObjects.add(cityCollection);

        cityCollection.events.add('click', function (e) {
            var activeGeoObject = e.get('target');
            cityCoords = activeGeoObject.geometry.getCoordinates();
            if (mapState == 'general') {
                    mainMap.setCenter(cityCoords, cityZoom);
                    mapState = 'city'
                    //activeGeoObject.options.set('iconImageHref', '/assets/images/logo.png');
                    activeGeoObject.openBaloon;
            } else {
                    mainMap.setCenter(mainCoords, mainZoom);
                    mapState = 'general'
                    //activeGeoObject.options.set('iconImageHref', '/assets/images/logo.png');
                    activeGeoObject.closeBaloon;
            }
        });
    }

    function findAndCreatePlacemark(name, index, array) {
        ymaps.geocode(name, { result: 1, kind: 'locality' }).then(
            function(res) {
                var firstGeoObject = res.geoObjects.get(0);
                coords = firstGeoObject.geometry.getCoordinates();
                cityMap.push([coords, index]);
                cityPlacemark = new ymaps.Placemark(coords, {
                    hintContent: "" + companyName + " в г." + firstGeoObject.properties.get('metaDataProperty.GeocoderMetaData.AddressDetails.Country.AdministrativeArea.SubAdministrativeArea.Locality.LocalityName'),
                    balloonContentBody: [
                        '<address>',
                        '<strong>' + companyName + ' в г.' + firstGeoObject.properties.get('metaDataProperty.GeocoderMetaData.AddressDetails.Country.AdministrativeArea.SubAdministrativeArea.Locality.LocalityName') + '</strong>',
                        '<br/>',
                        'Адрес: ' + name,
                        '</address>'
                    ].join('')
                }, placemarkOption);
                cityCollection.add(cityPlacemark);
                // Нужно дождаться ответа Геокодера
                if (showCityMap) {
                    if (i++ == array.length) { cityMap.forEach(createBranchMap);   }
                }
            })
    }

    function createBranchMap(data, index, array) {
        coords = data[0];
        id = 'map' + data[1];
        map = new ymaps.Map(id, {
            center: coords,
            zoom: cityZoom,
            controls: ['zoomControl'] 
        });
        map.behaviors.disable('scrollZoom');
        map.geoObjects.add(new ymaps.Placemark(coords, {}, branchOption));
    }

}