"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Language = "en" | "tl" | "mr" | "ar";

const STORAGE_KEY = "masjid-amanah-language";

const messages: Record<Language, Record<string, string>> = {
  // Maranao copy is an initial draft and should receive fluent community review before official adoption.
  en: {
    language: "Language",
    chooseLanguage: "Choose your preferred language",
    welcomeTitle: "Welcome to Masjid Amanah",
    welcomeIntro: "A place of worship, knowledge, unity, and community. Choose the language you feel most comfortable with.",
    welcomeHint: "You can change this any time from the language menu.",
    unofficial: "Unofficial mosque website",
    home: "Home", about: "About", prayerTimes: "Prayer times", programs: "Programs",
    learning: "Learning", madrasah: "Madrasah", news: "News", gallery: "Gallery",
    contact: "Contact", donationInfo: "Donation information", contactMosque: "Contact the mosque",
    closeNavigation: "Close navigation", openNavigation: "Open navigation",
    welcome: "Welcome · أهلاً وسهلاً",
    heroTitle: "A place to pause, pray, and belong.",
    heroIntro: "Welcome to Masjid Amanah — a place of worship, knowledge, unity, and community.",
    prayerInformation: "Prayer information", discoverMosque: "Discover the mosque",
    communityRooted: "A COMMUNITY, ROOTED IN FAITH",
    warmWelcome: "A warm welcome · مرحباً بكم",
    introTitle: "A home for worship, learning, and connection.",
    introBody: "Masjid Amanah's website brings together practical mosque information, community updates, learning resources, and ways to stay connected.",
    verificationNote: "Information specific to the mosque will be published only after it has been confirmed by its authorized representatives.",
    aboutMasjid: "About Masjid Amanah",
    explore: "Explore · اكتشف", findWhatYouNeed: "Find what you need.",
    resourcesIntro: "Useful information and community resources, gathered in one place.",
    prayerCopy: "Find the mosque's confirmed daily prayer information.",
    viewPrayerInfo: "View prayer information",
    learningCopy: "Explore educational resources with reliable references.",
    exploreResources: "Explore resources",
    programsCopy: "Discover classes, activities, and community gatherings.",
    seePrograms: "See programs",
    stayInformed: "Stay informed · ابق على اطلاع",
    updatesTitle: "News and community updates.",
    updatesIntro: "Official announcements and upcoming activities will be shared here when details are confirmed.",
    visitAnnouncements: "Visit announcements",
    officialAnnouncements: "Official announcements",
    latestAnnouncement: "Updates from Masjid Amanah.",
    announcementFallback: "Browse the announcements page for the latest information published by mosque management.",
    readAnnouncements: "Read announcements",
    support: "Support · المساهمة",
    supportTitle: "Support the mosque with confidence.",
    supportIntro: "Donation information will be shared only through payment methods and recipients verified by mosque management.",
    donationInformation: "Donation information",
    findMasjid: "Find Masjid Amanah",
    addressPending: "The official address and map location will be added after verification.",
    openMap: "Open map", contactInformation: "Contact information",
    footerTagline: "A place of worship, knowledge, unity, and community.",
    footerExplore: "Explore", footerInformation: "Information", footerOfficialDetails: "Official details",
    footerPending: "Address, contact channels, and official social links will be published after confirmation by mosque management.",
    pendingVerification: "Details pending verification",
    allRightsReserved: "All rights reserved.", privacyNotice: "Privacy notice",
    arabicWelcome: "Welcome to Masjid Amanah"
  },
  tl: {
    language: "Wika",
    chooseLanguage: "Piliin ang iyong gustong wika",
    welcomeTitle: "Maligayang pagdating sa Masjid Amanah",
    welcomeIntro: "Isang tahanan ng pagsamba, kaalaman, pagkakaisa, at komunidad. Piliin ang wikang pinakakomportable para sa iyo.",
    welcomeHint: "Maaari mong baguhin ito anumang oras sa menu ng wika.",
    unofficial: "Hindi opisyal na website ng moske",
    home: "Home", about: "Tungkol", prayerTimes: "Oras ng pagdarasal", programs: "Mga programa",
    learning: "Pag-aaral", madrasah: "Madrasah", news: "Balita", gallery: "Gallery",
    contact: "Makipag-ugnayan", donationInfo: "Impormasyon sa donasyon", contactMosque: "Makipag-ugnayan sa moske",
    closeNavigation: "Isara ang navigation", openNavigation: "Buksan ang navigation",
    welcome: "Maligayang pagdating · أهلاً وسهلاً",
    heroTitle: "Isang lugar upang huminto, magdasal, at mapabilang.",
    heroIntro: "Maligayang pagdating sa Masjid Amanah — isang tahanan ng pagsamba, kaalaman, pagkakaisa, at komunidad.",
    prayerInformation: "Impormasyon sa pagdarasal", discoverMosque: "Kilalanin ang moske",
    communityRooted: "ISANG KOMUNIDAD NA NAKASANDIG SA PANANAMPALATAYA",
    warmWelcome: "Taos-pusong pagtanggap · مرحباً بكم",
    introTitle: "Tahanan ng pagsamba, pag-aaral, at ugnayan.",
    introBody: "Pinagsasama-sama ng website ng Masjid Amanah ang mahahalagang impormasyon tungkol sa moske, mga balita ng komunidad, mga sanggunian sa pag-aaral, at mga paraan upang manatiling konektado.",
    verificationNote: "Ilalathala lamang ang impormasyong partikular sa moske kapag nakumpirma na ito ng mga awtorisadong kinatawan.",
    aboutMasjid: "Tungkol sa Masjid Amanah",
    explore: "Tuklasin · اكتشف", findWhatYouNeed: "Hanapin ang kailangan mo.",
    resourcesIntro: "Mahahalagang impormasyon at mga sanggunian ng komunidad sa iisang lugar.",
    prayerCopy: "Tingnan ang kumpirmadong araw-araw na impormasyon sa pagdarasal ng moske.",
    viewPrayerInfo: "Tingnan ang oras ng pagdarasal",
    learningCopy: "Tuklasin ang mga materyales sa pag-aaral na may mapagkakatiwalaang sanggunian.",
    exploreResources: "Tuklasin ang mga sanggunian",
    programsCopy: "Alamin ang mga klase, aktibidad, at pagtitipon ng komunidad.",
    seePrograms: "Tingnan ang mga programa",
    stayInformed: "Manatiling may alam · ابق على اطلاع",
    updatesTitle: "Mga balita at update ng komunidad.",
    updatesIntro: "Ibinabahagi rito ang mga opisyal na anunsyo at paparating na gawain kapag kumpirmado na ang mga detalye.",
    visitAnnouncements: "Tingnan ang mga anunsyo",
    officialAnnouncements: "Mga opisyal na anunsyo",
    latestAnnouncement: "Mga update mula sa Masjid Amanah.",
    announcementFallback: "Bisitahin ang pahina ng mga anunsyo para sa pinakabagong impormasyong inilathala ng pamunuan ng moske.",
    readAnnouncements: "Basahin ang mga anunsyo",
    support: "Suporta · المساهمة",
    supportTitle: "Suportahan ang moske nang may kumpiyansa.",
    supportIntro: "Ibabahagi lamang ang impormasyon sa donasyon gamit ang mga paraan ng pagbabayad at tatanggap na beripikado ng pamunuan ng moske.",
    donationInformation: "Impormasyon sa donasyon",
    findMasjid: "Hanapin ang Masjid Amanah",
    addressPending: "Idadagdag ang opisyal na address at lokasyon sa mapa kapag napatunayan na.",
    openMap: "Buksan ang mapa", contactInformation: "Impormasyon sa pakikipag-ugnayan",
    footerTagline: "Isang tahanan ng pagsamba, kaalaman, pagkakaisa, at komunidad.",
    footerExplore: "Tuklasin", footerInformation: "Impormasyon", footerOfficialDetails: "Mga opisyal na detalye",
    footerPending: "Ilalathala ang address, mga contact channel, at opisyal na social link kapag kinumpirma na ng pamunuan ng moske.",
    pendingVerification: "Naghihintay ng beripikasyon",
    allRightsReserved: "Lahat ng karapatan ay nakalaan.", privacyNotice: "Paunawa sa pribasiya",
    arabicWelcome: "Maligayang pagdating sa Masjid Amanah"
  },
  mr: {
    language: "Kalangowan",
    chooseLanguage: "Piliya so kalangowan a ipangilay iyo",
    welcomeTitle: "Mapiya a kapipita ko sa Masjid Amanah",
    welcomeIntro: "So Masjid Amanah, lalaran o sambayang, kasabotan, pagkasarilay ago kapamagayon. Piliya so kalangowan a masakop iyo.",
    welcomeHint: "Mapakay iyo a ilisan so kalangowan sa oras a pipiliin iyo.",
    unofficial: "Dai opisyal a website o masjid",
    home: "Home", about: "Klaro o Masjid", prayerTimes: "Oras o sambayang", programs: "Mga programa",
    learning: "Kangilay", madrasah: "Madrasah", news: "Mga balita", gallery: "Gallery",
    contact: "Pakipag-ugnay", donationInfo: "Klaro sa donasyon", contactMosque: "Pakipag-ugnay sa masjid",
    closeNavigation: "Sara so navigation", openNavigation: "Buksan so navigation",
    welcome: "Mapiya a kapipita · أهلاً وسهلاً",
    heroTitle: "Lalag a kapipira, sambayang, ago kapamagayon.",
    heroIntro: "Mapiya a kapipita ko sa Masjid Amanah — lalaran o sambayang, kasabotan, pagkasarilay ago kapamagayon.",
    prayerInformation: "Klaro sa sambayang", discoverMosque: "Kilalayi so masjid",
    communityRooted: "SO KAPAMAGAYON A NAKASANDIG SA PANANAMPALATAYA",
    warmWelcome: "Mapiya a kapipita · مرحباً بكم",
    introTitle: "Lalaran o sambayang, kangilay ago kapamagayon.",
    introBody: "So website o Masjid Amanah na kapamagayon sa mga importante a klaro sa masjid, balita o kapamagayon, mga gamit sa kangilay, ago mga paraan a kapakipag-ugnay.",
    verificationNote: "Ipublicar lamang so mga klaro a para sa masjid ko kapakumpirma iran sa mga awtorisado a representante.",
    aboutMasjid: "Klaro sa Masjid Amanah",
    explore: "Kilalayi · اكتشف", findWhatYouNeed: "Pangilayi so kailangan iyo.",
    resourcesIntro: "Mga importante a klaro ago gamit o kapamagayon sa isa a lugar.",
    prayerCopy: "Pangilayi so nakumpirma a adlaw-adlaw a oras o sambayang sa masjid.",
    viewPrayerInfo: "Pangilayi so oras o sambayang",
    learningCopy: "Pangilayi so mga gamit sa kangilay a igira sa mapagkakatiwalaan a sanggunian.",
    exploreResources: "Pangilayi so mga gamit",
    programsCopy: "Kilalayi so mga klase, aktibidad, ago pagtitipon o kapamagayon.",
    seePrograms: "Pangilayi so mga programa",
    stayInformed: "Pakapantag sa balita · ابق على اطلاع",
    updatesTitle: "Mga balita ago update o kapamagayon.",
    updatesIntro: "Mga opisyal a anunsyo ago mga aktibidad a madadating na ipakita dini ko kapakumpirma so mga detalye.",
    visitAnnouncements: "Pangilayi so mga anunsyo",
    officialAnnouncements: "Mga opisyal a anunsyo",
    latestAnnouncement: "Mga update gkan sa Masjid Amanah.",
    announcementFallback: "Pangilayi so pahina o mga anunsyo para sa bago a klaro a ipublicar o pamunuan o masjid.",
    readAnnouncements: "Basa so mga anunsyo",
    support: "Suporta · المساهمة",
    supportTitle: "Suportahi so masjid a may kumpiyansa.",
    supportIntro: "So klaro sa donasyon na ipakita lamang gamit so mga paraan o bayad ago mga tatanggap a nakumpirma o pamunuan o masjid.",
    donationInformation: "Klaro sa donasyon",
    findMasjid: "Pangilayi so Masjid Amanah",
    addressPending: "So opisyal a address ago lokasyon sa mapa na ilakip matapos ma-verify.",
    openMap: "Buksan so mapa", contactInformation: "Klaro sa pakipag-ugnay",
    footerTagline: "Lalaran o sambayang, kasabotan, pagkasarilay ago kapamagayon.",
    footerExplore: "Kilalayi", footerInformation: "Klaro", footerOfficialDetails: "Mga opisyal a detalye",
    footerPending: "So address, mga contact channel, ago opisyal a social link na ipublicar matapos kumpirmahan o pamunuan o masjid.",
    pendingVerification: "Pipitaron pa so beripikasyon",
    allRightsReserved: "Aton so karapatan.", privacyNotice: "Klaro sa pribasiya",
    arabicWelcome: "Mapiya a kapipita ko sa Masjid Amanah"
  },
  ar: {
    language: "اللغة",
    chooseLanguage: "اختر لغتك المفضلة",
    welcomeTitle: "مرحباً بكم في مسجد الأمانة",
    welcomeIntro: "مكان للعبادة والعلم والوحدة وخدمة المجتمع. اختر اللغة التي تفضلها.",
    welcomeHint: "يمكنك تغيير اللغة في أي وقت من قائمة اللغة.",
    unofficial: "موقع غير رسمي للمسجد",
    home: "الرئيسية", about: "عن المسجد", prayerTimes: "مواقيت الصلاة", programs: "البرامج",
    learning: "التعلم", madrasah: "المدرسة", news: "الأخبار", gallery: "المعرض",
    contact: "اتصل بنا", donationInfo: "معلومات التبرع", contactMosque: "التواصل مع المسجد",
    closeNavigation: "إغلاق القائمة", openNavigation: "فتح القائمة",
    welcome: "مرحباً · أهلاً وسهلاً",
    heroTitle: "مكان للسكينة والصلاة والانتماء.",
    heroIntro: "مرحباً بكم في مسجد الأمانة — مكان للعبادة والعلم والوحدة وخدمة المجتمع.",
    prayerInformation: "معلومات الصلاة", discoverMosque: "اكتشف المسجد",
    communityRooted: "مجتمع متجذر في الإيمان",
    warmWelcome: "أطيب الترحيب · مرحباً بكم",
    introTitle: "بيت للعبادة والتعلم والتواصل.",
    introBody: "يجمع موقع مسجد الأمانة معلومات المسجد المفيدة وأخبار المجتمع والموارد التعليمية ووسائل البقاء على تواصل.",
    verificationNote: "لن تُنشر المعلومات الخاصة بالمسجد إلا بعد تأكيدها من ممثليه المخولين.",
    aboutMasjid: "عن مسجد الأمانة",
    explore: "استكشف · اكتشف", findWhatYouNeed: "اعثر على ما تحتاج إليه.",
    resourcesIntro: "معلومات مفيدة وموارد مجتمعية في مكان واحد.",
    prayerCopy: "اطلع على معلومات الصلاة اليومية التي أكدها المسجد.",
    viewPrayerInfo: "عرض معلومات الصلاة",
    learningCopy: "استكشف الموارد التعليمية ذات المراجع الموثوقة.",
    exploreResources: "استكشف الموارد",
    programsCopy: "تعرف على الدروس والأنشطة واللقاءات المجتمعية.",
    seePrograms: "عرض البرامج",
    stayInformed: "ابق على اطلاع · ابق على اطلاع",
    updatesTitle: "الأخبار وتحديثات المجتمع.",
    updatesIntro: "ستُنشر الإعلانات الرسمية والأنشطة القادمة هنا بعد تأكيد تفاصيلها.",
    visitAnnouncements: "زيارة الإعلانات",
    officialAnnouncements: "الإعلانات الرسمية",
    latestAnnouncement: "آخر أخبار مسجد الأمانة.",
    announcementFallback: "تصفح صفحة الإعلانات للاطلاع على أحدث المعلومات المنشورة من إدارة المسجد.",
    readAnnouncements: "قراءة الإعلانات",
    support: "المساهمة · المساهمة",
    supportTitle: "ادعم المسجد بكل ثقة.",
    supportIntro: "لن تُنشر معلومات التبرع إلا عبر وسائل دفع ومستفيدين تتحقق منهم إدارة المسجد.",
    donationInformation: "معلومات التبرع",
    findMasjid: "موقع مسجد الأمانة",
    addressPending: "ستُضاف العناوين الرسمية وموقع الخريطة بعد التحقق.",
    openMap: "فتح الخريطة", contactInformation: "معلومات التواصل",
    footerTagline: "مكان للعبادة والعلم والوحدة وخدمة المجتمع.",
    footerExplore: "استكشف", footerInformation: "معلومات", footerOfficialDetails: "التفاصيل الرسمية",
    footerPending: "ستنشر إدارة المسجد العنوان وقنوات التواصل والروابط الاجتماعية الرسمية بعد تأكيدها.",
    pendingVerification: "التفاصيل بانتظار التحقق",
    allRightsReserved: "جميع الحقوق محفوظة.", privacyNotice: "إشعار الخصوصية",
    arabicWelcome: "مرحباً بكم في مسجد الأمانة"
  }
};

const textAliases: Record<string, string> = {
  "About the mosque": "about", "About": "about", "Prayer times": "prayerTimes",
  "Prayer information": "prayerInformation", "Programs": "programs", "Learning": "learning",
  "Madrasah": "madrasah", "News": "news", "Gallery": "gallery", "Contact": "contact",
  "Donation information": "donationInfo", "Contact & location": "contactInformation",
  "About Masjid Amanah": "aboutMasjid"
};


const pageTextTranslations: Record<Language, Record<string, string>> = {
  en: {},
  tl: {
    "About · عن المسجد": "Tungkol sa moske · عن المسجد",
    "A place for worship and community.": "Isang lugar para sa pagsamba at komunidad.",
    "Get to know Masjid Amanah through information shared and approved by its representatives.": "Kilalanin ang Masjid Amanah sa pamamagitan ng impormasyong ibinahagi at inaprubahan ng mga kinatawan nito.",
    "Prayer information · مواقيت الصلاة": "Impormasyon sa pagdarasal · مواقيت الصلاة",
    "Make space for prayer.": "Maglaan ng panahon para sa pagdarasal.",
    "Find the mosque's official prayer schedule and congregational information.": "Tingnan ang opisyal na iskedyul ng pagdarasal ng moske at impormasyon tungkol sa sama-samang pagdarasal.",
    "Community · المجتمع": "Komunidad · المجتمع",
    "Come together, learn, and grow.": "Magsama-sama, matuto, at umunlad.",
    "Explore the mosque's classes, events, and community activities.": "Tuklasin ang mga klase, kaganapan, at aktibidad ng komunidad ng moske.",
    "Knowledge · العلم": "Kaalaman · العلم",
    "Learn with care and reliable sources.": "Matuto gamit ang maingat na pagsusuri at mapagkakatiwalaang sanggunian.",
    "A space for educational resources shared with accurate references and appropriate review.": "Isang lugar para sa mga materyales sa pag-aaral na may wastong sanggunian at angkop na pagsusuri.",
    "Education · التعليم": "Edukasyon · التعليم",
    "Learning, growth, and a legacy of knowledge.": "Pagkatuto, pag-unlad, at pamana ng kaalaman.",
    "The Madrasah education section is being prepared as part of Masjid Amanah’s community learning work. Official program details and graduate names will appear here only after confirmation and approval.": "Inihahanda ang seksyon ng edukasyong Madrasah bilang bahagi ng pag-aaral ng komunidad ng Masjid Amanah. Ilalagay lamang dito ang opisyal na detalye ng programa at pangalan ng mga nagsipagtapos kapag nakumpirma at naaprubahan na.",
    "Updates · الأخبار": "Mga update · الأخبار",
    "What's happening at the mosque.": "Mga nagaganap sa moske.",
    "Official announcements, schedule updates, and community news from Masjid Amanah.": "Mga opisyal na anunsyo, pagbabago sa iskedyul, at balita ng komunidad mula sa Masjid Amanah.",
    "Gallery · معرض الصور": "Gallery · معرض الصور",
    "Moments from the community.": "Mga sandali kasama ang komunidad.",
    "Photographs of the actual mosque, its activities, and community life.": "Mga larawan ng mismong moske, mga aktibidad nito, at buhay ng komunidad.",
    "Get in touch · اتصل بنا": "Makipag-ugnayan · اتصل بنا",
    "We look forward to hearing from you.": "Ikinalulugod naming marinig mula sa iyo.",
    "Official contact and location information for Masjid Amanah.": "Opisyal na impormasyon sa pakikipag-ugnayan at lokasyon ng Masjid Amanah.",
    "Giving · الصدقة": "Pagbibigay · الصدقة",
    "Support the mosque responsibly.": "Suportahan ang moske nang responsable.",
    "Find clear, verified information about supporting Masjid Amanah and its community.": "Tingnan ang malinaw at beripikadong impormasyon tungkol sa pagsuporta sa Masjid Amanah at komunidad nito.",
    "Privacy · الخصوصية": "Pribasiya · الخصوصية",
    "Your information deserves care.": "Nararapat ingatan ang iyong impormasyon.",
    "This notice explains how information submitted through the Masjid Amanah website is intended to be handled.": "Ipinapaliwanag ng paunawang ito kung paano pinangangasiwaan ang impormasyong ipinapasa sa website ng Masjid Amanah."
  },
  mr: {
    "About · عن المسجد": "Klaro sa masjid · عن المسجد",
    "A place for worship and community.": "Lalag a para sa sambayang ago kapamagayon.",
    "Get to know Masjid Amanah through information shared and approved by its representatives.": "Kilalayi so Masjid Amanah giyapan sa mga klaro a ipapantag ago kinumpirma o mga representante iran.",
    "Prayer information · مواقيت الصلاة": "Klaro sa sambayang · مواقيت الصلاة",
    "Make space for prayer.": "Gawing oras para sa sambayang.",
    "Find the mosque's official prayer schedule and congregational information.": "Pangilayi so opisyal a schedule o sambayang ago mga klaro sa jamaah o masjid.",
    "Community · المجتمع": "Kapamagayon · المجتمع",
    "Come together, learn, and grow.": "Magkita, kangilay, ago umuswag.",
    "Explore the mosque's classes, events, and community activities.": "Kilalayi so mga klase, event, ago aktibidad o kapamagayon o masjid.",
    "Knowledge · العلم": "Kasabotan · العلم",
    "Learn with care and reliable sources.": "Kangilay a may pag-iingat ago mapagkakatiwalaan a mga sanggunian.",
    "A space for educational resources shared with accurate references and appropriate review.": "Lalag para sa mga gamit sa kangilay a may sakto a sanggunian ago angkop a pagsusuri.",
    "Education · التعليم": "Edukasyon · التعليم",
    "Learning, growth, and a legacy of knowledge.": "Kangilay, pag-uswag, ago pamana o kasabotan.",
    "The Madrasah education section is being prepared as part of Masjid Amanah’s community learning work. Official program details and graduate names will appear here only after confirmation and approval.": "Pipreparar so seksyon o Madrasah bilang parte o kangilay o kapamagayon o Masjid Amanah. Mga opisyal a klaro o programa ago mga ngaran o graduates na ipakita lamang matapos kumpirmahan ago aprobaran.",
    "Updates · الأخبار": "Mga update · الأخبار",
    "What's happening at the mosque.": "Mga pangyayari sa masjid.",
    "Official announcements, schedule updates, and community news from Masjid Amanah.": "Mga opisyal a anunsyo, update sa schedule, ago balita o kapamagayon gkan sa Masjid Amanah.",
    "Gallery · معرض الصور": "Gallery · معرض الصور",
    "Moments from the community.": "Mga oras o kapamagayon.",
    "Photographs of the actual mosque, its activities, and community life.": "Mga litrato o masjid, mga aktibidad iran, ago buhay o kapamagayon.",
    "Get in touch · اتصل بنا": "Pakipag-ugnay · اتصل بنا",
    "We look forward to hearing from you.": "Mapiya a pakipag-ugnay iyo sa ami.",
    "Official contact and location information for Masjid Amanah.": "Mga opisyal a klaro sa pakipag-ugnay ago lokasyon o Masjid Amanah.",
    "Giving · الصدقة": "Pagtabang · الصدقة",
    "Support the mosque responsibly.": "Tabangi so masjid a may pag-iingat.",
    "Find clear, verified information about supporting Masjid Amanah and its community.": "Pangilayi so klaro ago nakumpirma a impormasyon para sa pagtulong sa Masjid Amanah ago kapamagayon iran.",
    "Privacy · الخصوصية": "Pribasiya · الخصوصية",
    "Your information deserves care.": "Kailangan a pangalagaan so impormasyon iyo.",
    "This notice explains how information submitted through the Masjid Amanah website is intended to be handled.": "So notice a ini na paliwanag ko kano pangangalagaan so impormasyon a ipapadala pinaagi sa website o Masjid Amanah."
  },
  ar: {
    "About · عن المسجد": "عن المسجد · عن المسجد",
    "A place for worship and community.": "مكان للعبادة وخدمة المجتمع.",
    "Get to know Masjid Amanah through information shared and approved by its representatives.": "تعرّفوا على مسجد الأمانة من خلال المعلومات التي يشاركها ممثلوه ويعتمدونها.",
    "Prayer information · مواقيت الصلاة": "معلومات الصلاة · مواقيت الصلاة",
    "Make space for prayer.": "اجعلوا للصلاة وقتاً.",
    "Find the mosque's official prayer schedule and congregational information.": "اطلعوا على جدول الصلاة الرسمي للمسجد ومعلومات صلاة الجماعة.",
    "Community · المجتمع": "المجتمع · المجتمع",
    "Come together, learn, and grow.": "لنجتمع ونتعلم وننمو معاً.",
    "Explore the mosque's classes, events, and community activities.": "اكتشفوا دروس المسجد وفعالياته وأنشطة المجتمع.",
    "Knowledge · العلم": "العلم · العلم",
    "Learn with care and reliable sources.": "تعلّموا بعناية ومن مصادر موثوقة.",
    "A space for educational resources shared with accurate references and appropriate review.": "مساحة للمواد التعليمية ذات المراجع الدقيقة والمراجعة المناسبة.",
    "Education · التعليم": "التعليم · التعليم",
    "Learning, growth, and a legacy of knowledge.": "التعلم والنمو وإرث المعرفة.",
    "The Madrasah education section is being prepared as part of Masjid Amanah’s community learning work. Official program details and graduate names will appear here only after confirmation and approval.": "يجري إعداد قسم تعليم المدرسة ضمن جهود مسجد الأمانة التعليمية للمجتمع. ولن تُعرض تفاصيل البرامج الرسمية وأسماء الخريجين إلا بعد التأكيد والموافقة.",
    "Updates · الأخبار": "المستجدات · الأخبار",
    "What's happening at the mosque.": "ما الذي يحدث في المسجد.",
    "Official announcements, schedule updates, and community news from Masjid Amanah.": "الإعلانات الرسمية وتحديثات المواعيد وأخبار المجتمع من مسجد الأمانة.",
    "Gallery · معرض الصور": "معرض الصور · معرض الصور",
    "Moments from the community.": "لحظات من المجتمع.",
    "Photographs of the actual mosque, its activities, and community life.": "صور للمسجد وأنشطته وحياة المجتمع.",
    "Get in touch · اتصل بنا": "تواصل معنا · اتصل بنا",
    "We look forward to hearing from you.": "يسعدنا التواصل معكم.",
    "Official contact and location information for Masjid Amanah.": "معلومات الاتصال والموقع الرسمية لمسجد الأمانة.",
    "Giving · الصدقة": "العطاء · الصدقة",
    "Support the mosque responsibly.": "ساهموا في دعم المسجد بمسؤولية.",
    "Find clear, verified information about supporting Masjid Amanah and its community.": "اطلعوا على معلومات واضحة وموثوقة حول دعم مسجد الأمانة ومجتمعه.",
    "Privacy · الخصوصية": "الخصوصية · الخصوصية",
    "Your information deserves care.": "معلوماتكم تستحق الحماية.",
    "This notice explains how information submitted through the Masjid Amanah website is intended to be handled.": "يوضح هذا الإشعار كيفية التعامل مع المعلومات المرسلة عبر موقع مسجد الأمانة."
  }
};

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  translateText: (text: string) => string;
  welcomeOpen: boolean;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setCurrentLanguage] = useState<Language>("en");
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as Language | null;
    if (saved && ["en", "tl", "mr", "ar"].includes(saved)) {
      setCurrentLanguage(saved);
    } else {
      setWelcomeOpen(true);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === "tl" ? "fil" : language === "mr" ? "mrw" : language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  const setLanguage = useCallback((next: Language) => {
    setCurrentLanguage(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    setWelcomeOpen(false);
  }, []);

  const value = useMemo<LanguageContextValue>(() => ({
    language,
    setLanguage,
    t: (key) => messages[language][key] ?? messages.en[key] ?? key,
    translateText: (text) => {
      const directTranslation = pageTextTranslations[language][text];
      if (directTranslation) return directTranslation;
      const key = textAliases[text];
      return key ? (messages[language][key] ?? text) : text;
    },
    welcomeOpen: ready && welcomeOpen
  }), [language, ready, welcomeOpen, setLanguage]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
      {ready && welcomeOpen ? (
        <div className="language-welcome-backdrop" role="dialog" aria-modal="true" aria-labelledby="language-welcome-title">
          <section className="language-welcome-panel">
            <span className="language-welcome-mark" aria-hidden="true">۞</span>
            <span className="eyebrow">مسجد الأمانة</span>
            <h1 id="language-welcome-title">Welcome · Maligayang pagdating · Marhaban</h1>
            <p className="language-welcome-arabic" lang="ar" dir="rtl">مرحباً بكم في مسجد الأمانة</p>
            <p>Choose your preferred language to continue.</p>
            <div className="language-choice-grid">
              <button type="button" onClick={() => setLanguage("en")}><strong>English</strong><span>Continue in English</span></button>
              <button type="button" onClick={() => setLanguage("tl")}><strong>Filipino / Tagalog</strong><span>Magpatuloy sa Tagalog</span></button>
              <button type="button" onClick={() => setLanguage("mr")}><strong>Maranao</strong><span>Mapiya a kapipita</span></button>
              <button type="button" onClick={() => setLanguage("ar")} lang="ar"><strong>العربية</strong><span>المتابعة باللغة العربية</span></button>
            </div>
            <small>Your preference is saved on this device. You can change it at any time.</small>
          </section>
        </div>
      ) : null}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}
