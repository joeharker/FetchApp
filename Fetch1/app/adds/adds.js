app.factory('addsService', [
    function() {
        var s = this;
        var admobid = {};
        s.toggleMessage = "Hide Advertisements";

        //init
        if (/(android)/i.test(navigator.userAgent)) {
            admobid = {
                // for Android
                banner: 'ca-app-pub-1438477418297657/3974559721',
                interstitial: 'ca-app-pub-1438477418297657/3276555724'
            };
        } else if (/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {
            admobid = {
                // for iOS
                banner: 'ca-app-pub-1438477418297657/9881492520',
                interstitial: 'ca-app-pub-1438477418297657/1799822520'
            };
        } else {
            admobid = {
                // for Windows Phone
                banner: 'ca-app-pub-1438477418297657/6230022126',
                interstitial: 'ca-app-pub-1438477418297657/9183488527'
            };
        }

        s.toggleBanner = function () {
            if (s.toggleMessage === "Hide Advertisements") {
                hideBanner();
                s.toggleMessage = "Help keep the lights on";
            } else {
                showBanner(AdMob.AD_POSITION.BOTTOM_CENTER);
                s.toggleMessage = "Hide Advertisements";
            }
        };

        function initApp() {
            if (typeof AdMob !== "undefined") {
                if (AdMob) {
                    AdMob.createBanner({
                        adId: admobid.banner,
                        position: AdMob.AD_POSITION.BOTTOM_CENTER,
                        autoShow: true,
                        bgColor: 'brown'
                    });
                }
            } else {
                s.toggleMessage = "";
            }
        }

        document.addEventListener('deviceready', initApp, false);

        return s;
    }]);