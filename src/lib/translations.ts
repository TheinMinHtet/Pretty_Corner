export type Language = 'en' | 'my';

export type TranslationSchema = Record<
  | 'brandName'
  | 'brandSlogan'
  | 'footerDescription'
  | 'navHome'
  | 'navShop'
  | 'navReceipt'
  | 'navContact'
  | 'navBag'
  | 'heroBadge'
  | 'heroTitleLine1'
  | 'heroTitleLine2'
  | 'heroDescription'
  | 'heroCta'
  | 'exploreByCategory'
  | 'viewAll'
  | 'curatedPicks'
  | 'curatedSubtitle'
  | 'topPicksTitle'
  | 'shopMore'
  | 'exploreFullCollection'
  | 'storeLocationBadge'
  | 'storeLocationHeading'
  | 'storeLocationDescription'
  | 'inStockOnly'
  | 'freeDeliveryBadge'
  | 'catAll'
  | 'catElectrical'
  | 'catSkincare'
  | 'catMakeup'
  | 'catLifestyle'
  | 'catLenses'
  | 'catMore'
  | 'moreCategories'
  | 'allCategories'
  | 'selectCategoryToView'
  | 'active'
  | 'shopTitle'
  | 'shopSubtitle'
  | 'searchPlaceholder'
  | 'showing'
  | 'productsCount'
  | 'productCountSingular'
  | 'filters'
  | 'filterAndSort'
  | 'sortFeatured'
  | 'sortNewest'
  | 'sortPriceAsc'
  | 'sortPriceDesc'
  | 'noProductsMatch'
  | 'noProductsAdjust'
  | 'resetFilters'
  | 'filterByPrice'
  | 'priceRange'
  | 'availability'
  | 'onlyInStock'
  | 'clearAll'
  | 'applyFilters'
  | 'showMatchingProducts'
  | 'addBtn'
  | 'addToBag'
  | 'addedToBag'
  | 'back'
  | 'backToShop'
  | 'backToShopping'
  | 'whyWeLoveIt'
  | 'howToUse'
  | 'quantity'
  | 'itemAddedSuccess'
  | 'viewBag'
  | 'bagTitle'
  | 'bagEmptyTitle'
  | 'bagEmptySubtitle'
  | 'bagSubtitleEmpty'
  | 'bagSubtitleReady'
  | 'standardPackaging'
  | 'startShopping'
  | 'orderSummary'
  | 'subTotal'
  | 'discount'
  | 'discountTotal'
  | 'total'
  | 'delivery'
  | 'checkoutWithTotal'
  | 'continueShopping'
  | 'itemsCount'
  | 'itemCountSingular'
  | 'checkoutTitle'
  | 'checkoutSubtitle'
  | 'stepDelivery'
  | 'stepPayment'
  | 'stepConfirmation'
  | 'contactAndDelivery'
  | 'customerInfo'
  | 'fullName'
  | 'fullNameRequired'
  | 'fullNamePlaceholder'
  | 'phone'
  | 'phonePlaceholder'
  | 'deliveryAddress'
  | 'deliveryAddressRequired'
  | 'streetAddress'
  | 'streetAddressPlaceholder'
  | 'locateMe'
  | 'located'
  | 'locating'
  | 'pinOnMap'
  | 'hideMap'
  | 'pinMapHint'
  | 'pinMapDragging'
  | 'pinMapSuccess'
  | 'searchMapPlaceholder'
  | 'landmarkNote'
  | 'landmarkPlaceholder'
  | 'paymentMethod'
  | 'choosePaymentMethod'
  | 'mobileBanking'
  | 'cod'
  | 'mobileBankingDesc'
  | 'codDesc'
  | 'reviewAndPay'
  | 'confirmOrder'
  | 'proceedToPayment'
  | 'agreeTermsNotice'
  | 'terms'
  | 'and'
  | 'privacyPolicy'
  | 'paymentPendingTitle'
  | 'paymentPendingSubtitle'
  | 'oneLastStep'
  | 'completePaymentSecurely'
  | 'totalToPay'
  | 'openPaymentPage'
  | 'needHelpPayment'
  | 'paymentAuthorized'
  | 'confirmAndPay'
  | 'cancel'
  | 'orderConfirmed'
  | 'orderConfirmedJoy'
  | 'orderRef'
  | 'yourOrderRef'
  | 'copied'
  | 'officialReceipt'
  | 'downloadReceipt'
  | 'receiptDownloaded'
  | 'viewOrderReceipt'
  | 'paymentVerified'
  | 'orderStatus'
  | 'pendingReview'
  | 'yourBeautyPicks'
  | 'itemsOrdered'
  | 'deliveringTo'
  | 'deliveryDetails'
  | 'recipient'
  | 'address'
  | 'note'
  | 'saveOrderIdHint'
  | 'questionsHelp'
  | 'findReceipt'
  | 'findReceiptSubtitle'
  | 'orderIdPlaceholder'
  | 'orderIdLabel'
  | 'searchOrder'
  | 'orderNotFoundTitle'
  | 'orderNotFoundDesc'
  | 'searchByOrderId'
  | 'recentOrdersOnDevice'
  | 'customerCare'
  | 'aboutUs'
  | 'faqs'
  | 'termsAndConditions'
  | 'paymentAndDelivery'
  | 'doorstepDelivery'
  | 'township'
  | 'selectTownship'
  | 'promoCode'
  | 'promoPlaceholder'
  | 'apply'
  | 'promoApplied'
  | 'promoInvalid'
  | 'remove'
  | 'followUs'
  | 'followUsDesc'
  | 'allRightsReserved'
  | 'yangonMyanmar'
  | 'helpAndContact'
  | 'getHelpWithOrder'
  | 'questionsContact',
  string
>;

export const translations: Record<Language, TranslationSchema> = {
  en: {
    // Brand & Slogan
    brandName: 'Pretty Corner',
    brandSlogan: 'Beauty, Gadgets & Variety Edit',
    footerDescription: 'Your little corner of beauty and inspiration.',

    // Navigation & Tabs
    navHome: 'Home',
    navShop: 'All Products',
    navReceipt: 'Order Receipt',
    navContact: 'Contact',
    navBag: 'Bag',

    // Hero Section
    heroBadge: 'Your little corner of beauty and inspiration.',
    heroTitleLine1: 'Beauty, gadgets &',
    heroTitleLine2: 'daily essentials.',
    heroDescription: 'A little corner of beauty, style, and inspiration. Discover your pretty side with Pretty Corner.',
    heroCta: 'Explore all products',

    // Home Sections
    exploreByCategory: 'Explore by category',
    viewAll: 'View all',
    curatedPicks: 'Curated beauty & everyday picks',
    curatedSubtitle: 'Hand-selected items for your daily beauty, personal care, and lifestyle routine.',
    topPicksTitle: 'Top Picks & Highlights',
    shopMore: 'Shop more',
    exploreFullCollection: 'Explore full collection in shop',
    storeLocationBadge: 'Store Location & Online Orders',
    storeLocationHeading: "You're always welcome to visit us.",
    storeLocationDescription: 'Find our store address and contact details above, or easily order your favorite beauty & gadgets online with doorstep delivery.',
    inStockOnly: 'In Stock',
    freeDeliveryBadge: 'Free Delivery Across Myanmar',

    // Categories
    catAll: 'All Products',
    catElectrical: 'Electrical & Gadgets',
    catSkincare: 'Skincare',
    catMakeup: 'Makeup',
    catLifestyle: 'Lifestyle & Variety',
    catLenses: 'Contact Lenses',
    catMore: 'Accessories & More',
    moreCategories: '+ More Categories',
    allCategories: 'All Categories',
    selectCategoryToView: 'Select a category to view',
    active: 'Active',

    // Shop Catalog
    shopTitle: 'Our Collection',
    shopSubtitle: 'Discover curated beauty essentials, smart electricals, and everyday finds.',
    searchPlaceholder: 'Search products, electricals, gadgets…',
    showing: 'Showing',
    productsCount: 'products',
    productCountSingular: 'product',
    filters: 'Filters',
    filterAndSort: 'Filter & sort',
    sortFeatured: 'Sort: Featured',
    sortNewest: 'Sort: Newest',
    sortPriceAsc: 'Price: Low to High',
    sortPriceDesc: 'Price: High to Low',
    noProductsMatch: 'No products match your filters',
    noProductsAdjust: 'Try adjusting your price range or search keyword.',
    resetFilters: 'Reset all filters',
    filterByPrice: 'Price Range',
    priceRange: 'Price range',
    availability: 'Availability',
    onlyInStock: 'In stock items only',
    clearAll: 'Clear all filters',
    applyFilters: 'Apply filters',
    showMatchingProducts: 'Show matching products',

    // Product Card & Stepper
    addBtn: '+ Add',
    addToBag: 'Add to Bag',
    addedToBag: 'Added to bag',

    // Product Details View
    back: 'Back',
    backToShop: '← Back to shop',
    backToShopping: 'Back to shopping',
    whyWeLoveIt: 'Why we love it',
    howToUse: 'How to use',
    quantity: 'Quantity',
    itemAddedSuccess: 'Item added to your bag!',
    viewBag: 'View Bag',

    // Shopping Bag
    bagTitle: 'Beauty Bag',
    bagEmptyTitle: 'No beauty picks yet.',
    bagEmptySubtitle: 'Discover your next favorite pick from our curated collection.',
    bagSubtitleEmpty: 'Your beauty bag is currently empty.',
    bagSubtitleReady: 'ready for doorstep delivery.',
    standardPackaging: 'Standard packaging',
    startShopping: 'Start shopping',
    orderSummary: 'Order summary',
    subTotal: 'Sub Total',
    discount: 'Discount',
    discountTotal: 'Discount Total',
    total: 'Total',
    delivery: 'Delivery',
    checkoutWithTotal: 'Checkout ·',
    continueShopping: 'Continue shopping',
    itemsCount: 'items',
    itemCountSingular: 'item',

    // Checkout Steps
    checkoutTitle: 'Checkout',
    checkoutSubtitle: 'Fast, direct delivery across all townships.',
    stepDelivery: 'Delivery',
    stepPayment: 'Payment',
    stepConfirmation: 'Confirmation',
    contactAndDelivery: '1. Contact & delivery details',
    customerInfo: '1. Contact & Recipient Details',
    fullName: 'Full name *',
    fullNameRequired: 'Full name is required',
    fullNamePlaceholder: 'e.g. Daw Su Su / Ma Thida',
    phone: 'Phone number *',
    phonePlaceholder: 'e.g. 09 765 432 100',
    deliveryAddress: 'Delivery address *',
    deliveryAddressRequired: 'Delivery address is required',
    streetAddress: 'Street address & building / unit',
    streetAddressPlaceholder: 'e.g. No. 24, Insein Road, Building A, 3rd floor',
    locateMe: 'Use GPS location',
    located: 'Located',
    locating: 'Detecting GPS…',
    pinOnMap: 'Pin on Map',
    hideMap: 'Hide Map',
    pinMapHint: 'Click or drag the pin to set your exact location. The address will auto-fill below.',
    pinMapDragging: 'Locating pinned address…',
    pinMapSuccess: 'Address auto-filled from pinned location',
    searchMapPlaceholder: 'Search township, city, or street (e.g. Kamayut, Bahan)…',
    landmarkNote: 'Delivery landmark note (optional)',
    landmarkPlaceholder: 'e.g. Near Hledan Centre · Please call on arrival',
    paymentMethod: '2. Payment method',
    choosePaymentMethod: 'Choose your preferred payment method.',
    mobileBanking: 'Mobile Banking',
    cod: 'Cash on Delivery',
    mobileBankingDesc: 'MMQR instant transfer (all banking apps)',
    codDesc: 'Pay cash directly upon delivery',
    reviewAndPay: 'Review & pay',
    confirmOrder: 'Confirm Order',
    proceedToPayment: 'Proceed to Payment',
    agreeTermsNotice: 'By placing an order, you agree to our',
    terms: 'Terms',
    and: 'and',
    privacyPolicy: 'Privacy Policy',

    // Payment Pending / Info
    paymentPendingTitle: 'Complete Mobile Banking Transfer',
    paymentPendingSubtitle: 'Transfer via your preferred banking app to confirm your order.',
    oneLastStep: 'One last little step.',
    completePaymentSecurely: 'Complete your payment securely with',
    totalToPay: 'TOTAL TO PAY',
    openPaymentPage: 'Open secure payment page ↗',
    needHelpPayment: 'Need help or page didn’t open? Contact us with order reference',
    paymentAuthorized: '✓ Payment Authorized Successfully!',
    confirmAndPay: 'Confirm & Pay',
    cancel: 'Cancel',

    // Order Confirmation & Receipt
    orderConfirmed: 'Order Confirmed!',
    orderConfirmedJoy: 'A little joy is on its way.',
    orderRef: 'Order Reference',
    yourOrderRef: 'YOUR ORDER REFERENCE',
    copied: 'Copied!',
    officialReceipt: 'Official Purchase Receipt',
    downloadReceipt: 'Download Receipt (JPEG)',
    receiptDownloaded: 'Receipt Downloaded! ✓',
    viewOrderReceipt: 'View Order Receipt',
    paymentVerified: 'Payment Verified',
    orderStatus: 'Order status',
    pendingReview: 'Pending review',
    yourBeautyPicks: 'Your beauty picks',
    itemsOrdered: 'Items Ordered',
    deliveringTo: 'Delivering to',
    deliveryDetails: 'Delivery Details',
    recipient: 'Recipient',
    address: 'Address',
    note: 'Note',
    saveOrderIdHint: 'Save your Order ID! You can check your receipt anytime using only your ID — no login needed.',
    questionsHelp: 'Questions? We’re happy to help.',
    findReceipt: 'Find your order receipt.',
    findReceiptSubtitle: 'Enter your Order ID or phone number to view your receipt anytime. No login required.',
    orderIdPlaceholder: 'e.g. PC-261117-024 or 09...',
    orderIdLabel: 'Order ID or Phone Number *',
    searchOrder: 'View Order Receipt',
    orderNotFoundTitle: 'Receipt Not Found',
    orderNotFoundDesc: 'We couldn’t find an order matching that ID or phone number. Please verify and try again.',
    searchByOrderId: 'Search by Order ID',
    recentOrdersOnDevice: 'Recent orders on this device:',

    // Help & Contact
    helpAndContact: 'Help & Contact',
    getHelpWithOrder: 'Get Help With This Order',
    questionsContact: 'Questions? Contact Pretty Corner',

    // Footer
    customerCare: 'Customer Care',
    aboutUs: 'About us',
    faqs: 'FAQs',
    termsAndConditions: 'Terms & Conditions',
    paymentAndDelivery: 'Payment & Delivery',
    doorstepDelivery: 'Doorstep delivery & digital payment:',
    township: 'Delivery Township *',
    selectTownship: 'Select delivery township',
    promoCode: 'Promo Code',
    promoPlaceholder: 'e.g. PRETTY20',
    apply: 'Apply',
    promoApplied: 'Promo code applied!',
    promoInvalid: 'Invalid or expired promo code',
    remove: 'Remove',
    followUs: 'Follow Us',
    followUsDesc: 'Follow our socials for the latest updates:',
    allRightsReserved: 'All rights reserved.',
    yangonMyanmar: 'Yangon, Myanmar',
  },
  my: {
    // Brand & Slogan
    brandName: 'Pretty Corner',
    brandSlogan: 'အလှအပနှင့် လူနေမှုအသုံးအဆောင်များ',
    footerDescription: 'စိတ်တိုင်းကျလှပစေမယ့် အလှအပနှင့် လူနေမှုအသုံးအဆောင် ထောင့်စွန်းလေး',

    // Navigation & Tabs
    navHome: 'ပင်မ',
    navShop: 'ပစ္စည်းများ',
    navReceipt: 'ပြေစာကြည့်ရန်',
    navContact: 'ဆက်သွယ်ရန်',
    navBag: 'စျေးဝယ်အိတ်',

    // Hero Section
    heroBadge: 'စိတ်တိုင်းကျလှပစေမယ့် သီးသန့်ထောင့်စွန်းလေး',
    heroTitleLine1: 'အလှကုန်၊ အီလက်ထရောနစ်နှင့်',
    heroTitleLine2: 'နေ့စဉ်သုံးပစ္စည်းများ',
    heroDescription: 'အလှအပ၊ စတိုင်လ်နှင့် စိတ်ကျေနပ်မှုကို တစ်နေရာတည်းမှာ ရယူလိုက်ပါ။ Pretty Corner နှင့်အတူ ပိုမိုလှပလာပါစေ။',
    heroCta: 'ပစ္စည်းအားလုံး ကြည့်မည်',

    // Home Sections
    exploreByCategory: 'အမျိုးအစားအလိုက် ကြည့်ရန်',
    viewAll: 'အားလုံးကြည့်ရန်',
    curatedPicks: 'လူကြိုက်များသော ပစ္စည်းများ',
    curatedSubtitle: 'နေ့စဉ်အလှအပနှင့် သက်တောင့်သက်သာ လူနေမှုဘဝအတွက် အကောင်းဆုံးရွေးချယ်ထားသော ပစ္စည်းများ',
    topPicksTitle: 'အထူးရွေးချယ်ထားသော ပစ္စည်းများ',
    shopMore: 'ထပ်မံကြည့်ရှုရန်',
    exploreFullCollection: 'ဆိုင်ရှိ ပစ္စည်းအားလုံးကို ကြည့်ရှုရန်',
    storeLocationBadge: 'ဆိုင်လိပ်စာနှင့် အွန်လိုင်းအမှာစာများ',
    storeLocationHeading: 'ဆိုင်သို့ လူကိုယ်တိုင် လာရောက်လေ့လာရန် နွေးထွေးစွာ ကြိုဆိုပါသည်။',
    storeLocationDescription: 'အထက်ဖော်ပြပါ ဆိုင်လိပ်စာနှင့် ဆက်သွယ်ရန်အချက်အလက်များကို ကြည့်ရှုနိုင်သလို မိမိနှစ်သက်ရာ အလှအပနှင့် အီလက်ထရောနစ်ပစ္စည်းများကို အိမ်အရောက်ပို့စနစ်ဖြင့် အွန်လိုင်းမှ အလွယ်တကူ မှာယူနိုင်ပါသည်။',
    inStockOnly: 'ပစ္စည်းအသင့်ရှိ',
    freeDeliveryBadge: 'မြန်မာတစ်နိုင်ငံလုံး အိမ်ရောက်ပို့ဆောင်ပေးပါသည်',

    // Categories
    catAll: 'အားလုံး',
    catElectrical: 'အီလက်ထရောနစ်နှင့် ဂက်ဂျက်',
    catSkincare: 'အသားအရေထိန်းသိမ်း',
    catMakeup: 'မိတ်ကပ်',
    catLifestyle: 'လူနေမှုအသုံးအဆောင်',
    catLenses: 'မျက်ကပ်မှန်',
    catMore: 'အခြားအသုံးအဆောင်',
    moreCategories: '+ အခြားအမျိုးအစားများ',
    allCategories: 'အမျိုးအစားအားလုံး',
    selectCategoryToView: 'ကြည့်ရှုလိုသည့် အမျိုးအစားကို ရွေးချယ်ပါ',
    active: 'ရွေးချယ်ထားသည်',

    // Shop Catalog
    shopTitle: 'ကုန်ပစ္စည်းများ',
    shopSubtitle: 'အရည်အသွေးမြင့် အလှကုန်၊ အီလက်ထရောနစ်နှင့် နေ့စဉ်သုံးပစ္စည်းများကို စုံလင်စွာ ရွေးချယ်နိုင်ပါသည်။',
    searchPlaceholder: 'ပစ္စည်းအမည်၊ အလှကုန်၊ အီလက်ထရောနစ် ရှာရန်…',
    showing: 'ပစ္စည်း',
    productsCount: 'ခု ပြသထားပါသည်',
    productCountSingular: 'ခု ပြသထားပါသည်',
    filters: 'စစ်ထုတ်ရန်',
    filterAndSort: 'စစ်ထုတ်မှုနှင့် အစီအစဉ်',
    sortFeatured: 'လူကြိုက်များမှုအလိုက်',
    sortNewest: 'အသစ်ရောက်ပစ္စည်းများ',
    sortPriceAsc: 'စျေးနှုန်း အနည်းမှ အများ',
    sortPriceDesc: 'စျေးနှုန်း အများမှ အနည်း',
    noProductsMatch: 'ရှာဖွေထားသော အချက်အလက်နှင့်ကိုက်ညီသည့် ပစ္စည်းမရှိပါ',
    noProductsAdjust: 'စျေးနှုန်း အတိုင်းအတာ သို့မဟုတ် စကားလုံးကို ပြောင်းလဲရှာဖွေကြည့်ပါ။',
    resetFilters: 'မူလအတိုင်း ပြန်ထားမည်',
    filterByPrice: 'စျေးနှုန်း အတိုင်းအတာ',
    priceRange: 'စျေးနှုန်း အတိုင်းအတာ',
    availability: 'ပစ္စည်း အခြေအနေ',
    onlyInStock: 'ပစ္စည်းအသင့်ရှိတာပဲ ပြရန်',
    clearAll: 'အားလုံးရှင်းမည်',
    applyFilters: 'ရွေးချယ်မှု အတည်ပြုမည်',
    showMatchingProducts: 'ကိုက်ညီသော ပစ္စည်းများ ပြသမည်',

    // Product Card & Stepper
    addBtn: '+ ထည့်မည်',
    addToBag: 'အိတ်ထဲထည့်မည်',
    addedToBag: 'အိတ်ထဲထည့်ပြီးပါပြီ',

    // Product Details View
    back: 'ရှေ့သို့ပြန်သွားမည်',
    backToShop: '← စျေးဆိုင်သို့ ပြန်သွားမည်',
    backToShopping: 'စျေးဆက်ဝယ်မည်',
    whyWeLoveIt: 'သဘောကျရသည့် အချက်များ',
    howToUse: 'အသုံးပြုပုံ ညွှန်ကြားချက်',
    quantity: 'အရေအတွက်',
    itemAddedSuccess: 'ပစ္စည်းကို စျေးဝယ်အိတ်ထဲ ထည့်သွင်းပြီးပါပြီ!',
    viewBag: 'စျေးဝယ်အိတ် ကြည့်မည်',

    // Shopping Bag
    bagTitle: 'စျေးဝယ်အိတ်',
    bagEmptyTitle: 'စျေးဝယ်အိတ်ထဲတွင် ပစ္စည်းမရှိသေးပါ',
    bagEmptySubtitle: 'မိမိနှစ်သက်ရာ အလှအပနှင့် လူနေမှုအသုံးအဆောင်များကို လွတ်လပ်စွာ ရွေးချယ်လိုက်ပါ။',
    bagSubtitleEmpty: 'သင့်စျေးဝယ်အိတ်ထဲတွင် ပစ္စည်းမရှိသေးပါ။',
    bagSubtitleReady: 'အိမ်အရောက်ပို့ဆောင်ရန် အသင့်ရှိပါသည်။',
    standardPackaging: 'ပုံမှန်ထုပ်ပိုးမှု',
    startShopping: 'စျေးစဝယ်မည်',
    orderSummary: 'အမှာစာ အကျဉ်းချုပ်',
    subTotal: 'စုစုပေါင်းကုန်ကျငွေ',
    discount: 'လျှော့စျေး',
    discountTotal: 'စုစုပေါင်း လျှော့စျေး',
    total: 'ကျသင့်ငွေ စုစုပေါင်း',
    delivery: 'ပို့ဆောင်ခ',
    checkoutWithTotal: 'ငွေရှင်းမည် ·',
    continueShopping: 'စျေးဆက်ဝယ်မည်',
    itemsCount: 'ခု',
    itemCountSingular: 'ခု',

    // Checkout Steps
    checkoutTitle: 'ငွေရှင်းရန်',
    checkoutSubtitle: 'မြို့နယ်အားလုံးသို့ မြန်ဆန်စွာ အိမ်တိုင်ရာရောက် ပို့ဆောင်ပေးပါသည်။',
    stepDelivery: 'ပို့ဆောင်မှု',
    stepPayment: 'ငွေပေးချေမှု',
    stepConfirmation: 'အတည်ပြုချက်',
    contactAndDelivery: '၁။ ဆက်သွယ်ရန်နှင့် ပို့ဆောင်ရမည့်လိပ်စာ',
    customerInfo: '၁။ လက်ခံသူ အချက်အလက်',
    fullName: 'အမည် *',
    fullNameRequired: 'အမည် ဖြည့်စွက်ရန် လိုအပ်ပါသည်',
    fullNamePlaceholder: 'ဥပမာ - မနှင်းနှင်း / ဒေါ်စုစု',
    phone: 'ဖုန်းနံပါတ် *',
    phonePlaceholder: 'ဥပမာ - 09 765 432 100',
    deliveryAddress: 'ပို့ဆောင်ရမည့် လိပ်စာ *',
    deliveryAddressRequired: 'လိပ်စာ ဖြည့်စွက်ရန် လိုအပ်ပါသည်',
    streetAddress: 'လမ်းအမည်၊ တိုက်/အခန်းအမှတ်၊ မြို့နယ်',
    streetAddressPlaceholder: 'ဥပမာ - အမှတ် (၂၄)၊ အင်းစိန်လမ်း၊ အဆောင် (A)၊ တတိယထပ်',
    locateMe: 'လက်ရှိတည်နေရာ ယူမည်',
    located: 'တည်နေရာ ယူပြီးပါပြီ',
    locating: 'တည်နေရာ ရှာဖွေနေပါသည်…',
    pinOnMap: 'မြေပုံပေါ်တွင် နေရာမှတ်မည်',
    hideMap: 'မြေပုံပိတ်မည်',
    pinMapHint: 'မြေပုံပေါ်တွင် နှိပ်၍ သို့မဟုတ် အမှတ်အသားကို ရွှေ့ပြီး နေရာသတ်မှတ်ပါ။ လိပ်စာ အလိုအလျောက် ဖြည့်ပေးပါမည်။',
    pinMapDragging: 'လိပ်စာ ရှာဖွေနေပါသည်…',
    pinMapSuccess: 'မြေပုံနေရာမှ လိပ်စာကို အလိုအလျောက် ဖြည့်ပြီးပါပြီ',
    searchMapPlaceholder: 'မြို့နယ်၊ မြို့ သို့မဟုတ် လမ်းအမည် ရှာဖွေပါ…',
    landmarkNote: 'မှတ်ချက် / အထူးမှာကြားချက် (မဖြစ်မနေ မလိုပါ)',
    landmarkPlaceholder: 'ဥပမာ - လှည်းတန်းစင်တာအနီး၊ အိမ်ရောက်လျှင် ဖုန်းအရင်ဆက်ပေးပါ',
    paymentMethod: '၂။ ငွေချေစနစ် ရွေးချယ်ရန်',
    choosePaymentMethod: 'မိမိအဆင်ပြေရာ ငွေချေစနစ်ကို ရွေးချယ်ပေးပါ။',
    mobileBanking: 'မိုဘိုင်းဘဏ်ဖြင့် ငွေချေမည်',
    cod: 'ပစ္စည်းရောက်မှ ငွေချေမည် (COD)',
    mobileBankingDesc: 'MMQR ဖြင့် မည်သည့်ဘဏ်အက်ပ်ဖြင့်မဆို စကင်ဖတ်ငွေလွှဲနိုင်ပါသည်',
    codDesc: 'အိမ်အရောက် ပစ္စည်းလက်ခံရရှိချိန်မှ ငွေချေပါ',
    reviewAndPay: 'အမှာစာ စစ်ဆေးပြီး ငွေချေမည်',
    confirmOrder: 'အမှာစာ အတည်ပြုမည်',
    proceedToPayment: 'ငွေလွှဲရန် အဆင့်သို့ ဆက်သွားမည်',
    agreeTermsNotice: 'အမှာစာတင်သွင်းခြင်းဖြင့် ကျွန်ုပ်တို့၏',
    terms: 'စည်းကမ်းသတ်မှတ်ချက်များ',
    and: 'နှင့်',
    privacyPolicy: 'ကိုယ်ရေးအချက်အလက် မူဝါဒ',

    // Payment Pending / Info
    paymentPendingTitle: 'မိုဘိုင်းဘဏ်မှ ငွေလွှဲပေးပါရန်',
    paymentPendingSubtitle: 'အမှာစာအတည်ပြုနိုင်ရန် မိမိနှစ်သက်ရာ မိုဘိုင်းဘဏ်အကောင့်သို့ လွှဲပေးပါရန်။',
    oneLastStep: 'နောက်ဆုံး အဆင့်လေးပါခင်ဗျာ။',
    completePaymentSecurely: 'စိတ်ချလုံခြုံစွာ ငွေလွှဲနိုင်ပါသည် -',
    totalToPay: 'စုစုပေါင်း ပေးချေရမည့်ငွေ',
    openPaymentPage: 'ငွေလွှဲရန် အဆင့်သို့ သွားမည် ↗',
    needHelpPayment: 'အကူအညီလိုအပ်ပါက အမှာစာအမှတ်ဖြင့် ဆက်သွယ်မေးမြန်းနိုင်ပါသည် -',
    paymentAuthorized: '✓ ငွေပေးချေမှု အောင်မြင်ပါသည်!',
    confirmAndPay: 'ငွေပေးချေမှု အတည်ပြုမည်',
    cancel: 'မလုပ်တော့ပါ',

    // Order Confirmation & Receipt
    orderConfirmed: 'အမှာစာ တင်ပြီးပါပြီ!',
    orderConfirmedJoy: 'သင့်စိတ်တိုင်းကျ ပစ္စည်းလေးများ မကြာမီ ရောက်ရှိလာပါတော့မည်။',
    orderRef: 'အမှာစာ အမှတ် (Order ID)',
    yourOrderRef: 'သင့်အမှာစာ အမှတ်',
    copied: 'ကူးယူပြီးပါပြီ!',
    officialReceipt: 'တရားဝင် အရောင်းပြေစာ',
    downloadReceipt: 'ပြေစာ သိမ်းဆည်းမည် (JPEG)',
    receiptDownloaded: 'ပြေစာ သိမ်းဆည်းပြီးပါပြီ! ✓',
    viewOrderReceipt: 'အမှာစာပြေစာ ကြည့်မည်',
    paymentVerified: 'ငွေပေးချေမှု စစ်ဆေးအတည်ပြုပြီး',
    orderStatus: 'အမှာစာ အခြေအနေ',
    pendingReview: 'စစ်ဆေးဆဲ',
    yourBeautyPicks: 'မှာယူထားသော ပစ္စည်းများ',
    itemsOrdered: 'မှာယူထားသော ပစ္စည်းများ',
    deliveringTo: 'ပို့ဆောင်မည့်သူ',
    deliveryDetails: 'ပို့ဆောင်မှု အသေးစိတ်',
    recipient: 'လက်ခံသူ',
    address: 'လိပ်စာ',
    note: 'မှတ်ချက်',
    saveOrderIdHint: 'အမှာစာအမှတ် (Order ID) ကို သိမ်းထားပေးပါ! အကောင့်ဖွင့်စရာမလိုဘဲ အချိန်မရွေး ပြေစာပြန်လည်ကြည့်ရှုနိုင်ပါသည်။',
    questionsHelp: 'မေးမြန်းလိုသည်များရှိပါက အချိန်မရွေး ကူညီပေးပါမည်။',
    findReceipt: 'မိမိအမှာစာပြေစာ ရှာရန်',
    findReceiptSubtitle: 'အကောင့်ဖွင့်စရာမလိုဘဲ အမှာစာအမှတ် (Order ID) သို့မဟုတ် ဖုန်းနံပါတ်ဖြင့် အချိန်မရွေး ပြေစာကြည့်နိုင်ပါသည်။',
    orderIdPlaceholder: 'ဥပမာ - PC-261117-024 သို့မဟုတ် 09...',
    orderIdLabel: 'အမှာစာ အမှတ် သို့မဟုတ် ဖုန်းနံပါတ် *',
    searchOrder: 'ပြေစာကြည့်မည်',
    orderNotFoundTitle: 'ပြေစာ ရှာမတွေ့ပါ',
    orderNotFoundDesc: 'ထိုအမှာစာအမှတ် သို့မဟုတ် ဖုန်းနံပါတ်နှင့် ကိုက်ညီသော ပြေစာမရှိပါ။ ကျေးဇူးပြု၍ သေချာစစ်ဆေးပြီး ထပ်မံကြိုးစားကြည့်ပါ။',
    searchByOrderId: 'အမှာစာအမှတ်ဖြင့် ရှာမည်',
    recentOrdersOnDevice: 'မကြာသေးမီက တင်ထားသော အမှာစာများ -',

    // Help & Contact
    helpAndContact: 'အကူအညီနှင့် ဆက်သွယ်ရန်',
    getHelpWithOrder: 'ဤအမှာစာအတွက် အကူအညီရယူရန်',
    questionsContact: 'မေးမြန်းလိုပါက ဆက်သွယ်ရန်',

    // Footer
    customerCare: 'ဝန်ဆောင်မှု အကူအညီ',
    aboutUs: 'Pretty Corner အကြောင်း',
    faqs: 'မေးလေ့ရှိသော မေးခွန်းများ',
    termsAndConditions: 'စည်းကမ်းသတ်မှတ်ချက်များ',
    paymentAndDelivery: 'ငွေပေးချေမှုနှင့် ပို့ဆောင်ရေး',
    doorstepDelivery: 'အိမ်တိုင်ရာရောက် ပို့ဆောင်မှုနှင့် မိုဘိုင်းငွေချေစနစ် -',
    township: 'ပို့ဆောင်မည့် မြို့နယ် *',
    selectTownship: 'မြို့နယ် ရွေးချယ်ပါ',
    promoCode: 'ပရိုမိုးရှင်းကုဒ်',
    promoPlaceholder: 'ဥပမာ - PRETTY20',
    apply: 'ထည့်သွင်းမည်',
    promoApplied: 'ပရိုမိုးရှင်းကုဒ် အောင်မြင်စွာ ထည့်သွင်းပြီးပါပြီ!',
    promoInvalid: 'ပရိုမိုးရှင်းကုဒ် မမှန်ကန်ပါ သို့မဟုတ် သက်တမ်းကုန်သွားပါပြီ',
    remove: 'ဖယ်ရှားမည်',
    followUs: 'ကျွန်ုပ်တို့၏ လူမှုကွန်ရက်များ',
    followUsDesc: 'နောက်ဆုံးရ ပစ္စည်းအသစ်များနှင့် ပရိုမိုးရှင်းများကို စောင့်ကြည့်လိုက်ပါ -',
    allRightsReserved: 'မူပိုင်ခွင့်များ ရယူထားပြီးဖြစ်ပါသည်။',
    yangonMyanmar: 'ရန်ကုန်၊ မြန်မာ',
  },
} as const;
