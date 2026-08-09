export interface CountryData {
  name: string;
  code: string;
  states: string[];
}

export const COUNTRIES_DATA: CountryData[] = [
  {
    name: "United States",
    code: "1",
    states: [
      "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", 
      "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", 
      "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", 
      "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", 
      "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", 
      "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", 
      "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", 
      "Wisconsin", "Wyoming"
    ]
  },
  {
    name: "Canada",
    code: "1",
    states: [
      "Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador", 
      "Nova Scotia", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan"
    ]
  },
  {
    name: "United Kingdom",
    code: "44",
    states: ["England", "Scotland", "Wales", "Northern Ireland"]
  },
  {
    name: "Australia",
    code: "61",
    states: [
      "New South Wales", "Victoria", "Queensland", "Western Australia", "South Australia", 
      "Tasmania", "Australian Capital Territory", "Northern Territory"
    ]
  },
  {
    name: "India",
    code: "91",
    states: [
      "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
      "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", 
      "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", 
      "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
      "Uttarakhand", "West Bengal", "Delhi"
    ]
  },
  {
    name: "Germany",
    code: "49",
    states: [
      "Baden-Württemberg", "Bavaria", "Berlin", "Brandenburg", "Bremen", "Hamburg", "Hesse", 
      "Lower Saxony", "Mecklenburg-Vorpommern", "North Rhine-Westphalia", "Rhineland-Palatinate", 
      "Saarland", "Saxony", "Saxony-Anhalt", "Schleswig-Holstein", "Thuringia"
    ]
  },
  {
    name: "France",
    code: "33",
    states: [
      "Auvergne-Rhône-Alpes", "Bourgogne-Franche-Comté", "Brittany", "Centre-Val de Loire", 
      "Corsica", "Grand Est", "Hauts-de-France", "Île-de-France", "Normandy", "Nouvelle-Aquitaine", 
      "Occitanie", "Pays de la Loire", "Provence-Alpes-Côte d'Azur"
    ]
  },
  {
    name: "Japan",
    code: "81",
    states: [
      "Aichi", "Akita", "Aomori", "Chiba", "Ehime", "Fukui", "Fukuoka", "Fukushima", "Gifu", 
      "Gumma", "Hiroshima", "Hokkaido", "Hyogo", "Ibaraki", "Ishikawa", "Iwate", "Kagawa", 
      "Kagoshima", "Kanagawa", "Kochi", "Kumamoto", "Kyoto", "Mie", "Miyagi", "Miyazaki", 
      "Nagano", "Nagasaki", "Nara", "Niigata", "Oita", "Okayama", "Okinawa", "Osaka", "Saga", 
      "Saitama", "Shiga", "Shimane", "Shizuoka", "Tochigi", "Tokushima", "Tokyo", "Tottori", 
      "Toyama", "Wakayama", "Yamagata", "Yamaguchi", "Yamanashi"
    ]
  },
  {
    name: "Singapore",
    code: "65",
    states: ["Central Region", "East Region", "North Region", "West Region", "North-East Region"]
  },
  {
    name: "Brazil",
    code: "55",
    states: [
      "Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará", "Distrito Federal", "Espírito Santo", 
      "Goiás", "Maranhão", "Mato Grosso", "Mato Grosso do Sul", "Minas Gerais", "Pará", "Paraíba", 
      "Paraná", "Pernambuco", "Piauí", "Rio de Janeiro", "Rio Grande do Norte", "Rio Grande do Sul", 
      "Rondônia", "Roraima", "Santa Catarina", "São Paulo", "Sergipe", "Tocantins"
    ]
  },
  {
    name: "South Africa",
    code: "27",
    states: [
      "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal", "Limpopo", "Mpumalanga", 
      "North West", "Northern Cape", "Western Cape"
    ]
  },
  {
    name: "Mexico",
    code: "52",
    states: [
      "Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Chiapas", "Chihuahua", 
      "Coahuila", "Colima", "Durango", "Guanajuato", "Guerrero", "Hidalgo", "Jalisco", "Mexico State", 
      "Mexico City", "Michoacán", "Morelos", "Nayarit", "Nuevo León", "Oaxaca", "Puebla", "Querétaro", 
      "Quintana Roo", "San Luis Potosí", "Sinaloa", "Sonora", "Tabasco", "Tamaulipas", "Tlaxcala", 
      "Veracruz", "Yucatán", "Zacatecas"
    ]
  },
  {
    name: "Italy",
    code: "39",
    states: [
      "Abruzzo", "Basilicata", "Calabria", "Campania", "Emilia-Romagna", "Friuli-Venezia Giulia", 
      "Lazio", "Liguria", "Lombardy", "Marches", "Molise", "Piedmont", "Apulia", "Sardinia", 
      "Sicily", "Tuscany", "Trentino-Alto Adige", "Umbria", "Aosta Valley", "Veneto"
    ]
  },
  {
    name: "Spain",
    code: "34",
    states: [
      "Andalusia", "Aragon", "Asturias", "Balearic Islands", "Basque Country", "Canary Islands", 
      "Cantabria", "Castile and León", "Castile-La Mancha", "Catalonia", "Extremadura", "Galicia", 
      "Madrid", "Murcia", "Navarre", "La Rioja", "Valencia"
    ]
  },
  {
    name: "Netherlands",
    code: "31",
    states: [
      "Drenthe", "Flevoland", "Friesland", "Gelderland", "Groningen", "Limburg", "Noord-Brabant", 
      "Noord-Holland", "Overijssel", "Utrecht", "Zeeland", "Zuid-Holland"
    ]
  },
  {
    name: "Switzerland",
    code: "41",
    states: [
      "Aargau", "Appenzell Ausserrhoden", "Appenzell Innerrhoden", "Basel-Landschaft", "Basel-Stadt", 
      "Bern", "Fribourg", "Geneva", "Glarus", "Graubünden", "Jura", "Lucerne", "Neuchâtel", 
      "Nidwalden", "Obwalden", "Schaffhausen", "Schwyz", "Solothurn", "St. Gallen", "Thurgau", 
      "Ticino", "Uri", "Valais", "Vaud", "Zug", "Zurich"
    ]
  },
  {
    name: "New Zealand",
    code: "64",
    states: [
      "Auckland", "Bay of Plenty", "Canterbury", "Gisborne", "Hawke's Bay", "Manawatū-Whanganui", 
      "Marlborough", "Nelson", "Northland", "Otago", "Southland", "Taranaki", "Tasman", 
      "Waikato", "Wairarapa", "Wellington", "West Coast"
    ]
  },
  {
    name: "China",
    code: "86",
    states: [
      "Anhui", "Beijing", "Chongqing", "Fujian", "Gansu", "Guangdong", "Guangxi", "Guizhou", 
      "Hainan", "Hebei", "Heilongjiang", "Henan", "Hubei", "Hunan", "Jiangsu", "Jiangxi", 
      "Jilin", "Liaoning", "Ningxia", "Qinghai", "Shaanxi", "Shandong", "Shanghai", "Shanxi", 
      "Sichuan", "Tianjin", "Tibet", "Xinjiang", "Yunnan", "Zhejiang"
    ]
  },
  {
    name: "South Korea",
    code: "82",
    states: [
      "Seoul", "Busan", "Daegu", "Incheon", "Gwangju", "Daejeon", "Ulsan", "Sejong", "Gyeonggi", 
      "Gangwon", "North Chungcheong", "South Chungcheong", "North Jeolla", "South Jeolla", 
      "North Gyeongsang", "South Gyeongsang", "Jeju"
    ]
  },
  {
    name: "Ireland",
    code: "353",
    states: ["Carlow", "Cavan", "Clare", "Cork", "Donegal", "Dublin", "Galway", "Kerry", "Kildare", "Kilkenny", "Laois", "Leitrim", "Limerick", "Longford", "Louth", "Mayo", "Meath", "Monaghan", "Offaly", "Roscommon", "Sligo", "Tipperary", "Waterford", "Westmeath", "Wexford", "Wicklow"]
  },
  {
    name: "Sweden",
    code: "46",
    states: [
      "Blekinge", "Dalarna", "Gotland", "Gävleborg", "Halland", "Jämtland", "Jönköping", "Kalmar", 
      "Kronoberg", "Norrbotten", "Skåne", "Stockholm", "Södermanland", "Uppsala", "Värmland", 
      "Västerbotten", "Västernorrland", "Västmanland", "Västra Götaland", "Örebro", "Östergötland"
    ]
  },
  {
    name: "Norway",
    code: "47",
    states: [
      "Agder", "Innlandet", "Møre og Romsdal", "Nordland", "Oslo", "Rogaland", "Troms og Finnmark", 
      "Trøndelag", "Vestfold og Telemark", "Vestland", "Viken"
    ]
  },
  {
    name: "Denmark",
    code: "45",
    states: ["Hovedstaden", "Midtjylland", "Nordjylland", "Sjælland", "Syddanmark"]
  },
  {
    name: "Finland",
    code: "358",
    states: [
      "Åland Islands", "Central Finland", "Central Ostrobothnia", "Kainuu", "Kanta-Häme", "Kymenlaakso", 
      "Lapland", "North Karelia", "North Ostrobothnia", "North Savo", "Ostrobothnia", "Päijät-Häme", 
      "Pirkanmaa", "Satakunta", "South Karelia", "South Ostrobothnia", "South Savo", "Southwest Finland", 
      "Uusimaa"
    ]
  },
  {
    name: "Austria",
    code: "43",
    states: [
      "Burgenland", "Carinthia", "Lower Austria", "Salzburg", "Styria", "Tyrol", "Upper Austria", 
      "Vienna", "Vorarlberg"
    ]
  },
  {
    name: "Belgium",
    code: "32",
    states: [
      "Antwerp", "East Flanders", "Flemish Brabant", "Limburg", "West Flanders", 
      "Hainaut", "Liège", "Luxembourg", "Namur", "Walloon Brabant", "Brussels-Capital"
    ]
  },
  {
    name: "United Arab Emirates",
    code: "971",
    states: ["Abu Dhabi", "Dubai", "Sharjah", "Ajman", "Umm Al Quwain", "Ras Al Khaimah", "Fujairah"]
  },
  {
    name: "Saudi Arabia",
    code: "966",
    states: [
      "Al-Bahah", "Al-Jawf", "Al-Qassim", "Asir", "Eastern Province", "Ha'il", "Jazan", 
      "Madinah", "Makkah", "Najran", "Northern Borders", "Riyadh", "Tabuk"
    ]
  },
  {
    name: "Israel",
    code: "972",
    states: ["Central District", "Haifa", "Jerusalem", "Northern District", "Southern District", "Tel Aviv"]
  },
  {
    name: "Argentina",
    code: "54",
    states: [
      "Buenos Aires", "Catamarca", "Chaco", "Chubut", "Córdoba", "Corrientes", "Entre Ríos", 
      "Formosa", "Jujuy", "La Pampa", "La Rioja", "Mendoza", "Misiones", "Neuquén", "Río Negro", 
      "Salta", "San Juan", "San Luis", "Santa Cruz", "Santa Fe", "Santiago del Estero", 
      "Tierra del Fuego", "Tucumán"
    ]
  },
  {
    name: "Chile",
    code: "56",
    states: [
      "Aisén", "Antofagasta", "Araucanía", "Arica y Parinacota", "Atacama", "Bío-Bío", "Coquimbo", 
      "Libertador General Bernardo O'Higgins", "Los Lagos", "Los Ríos", "Magallanes y de la Antártica Chilena", 
      "Maule", "Metropolitana de Santiago", "Ñuble", "Tarapacá", "Valparaíso"
    ]
  },
  {
    name: "Colombia",
    code: "57",
    states: [
      "Amazonas", "Antioquia", "Arauca", "Atlántico", "Bolívar", "Boyacá", "Caldas", "Caquetá", 
      "Casanare", "Cauca", "Cesar", "Chocó", "Córdoba", "Cundinamarca", "Guainía", "Guaviare", 
      "Huila", "La Guajira", "Magdalena", "Meta", "Nariño", "Norte de Santander", "Putumayo", 
      "Quindío", "Risaralda", "San Andrés y Providencia", "Santander", "Sucre", "Tolima", 
      "Valle del Cauca", "Vaupés", "Vichada"
    ]
  },
  {
    name: "Peru",
    code: "51",
    states: [
      "Amazonas", "Ancash", "Apurímac", "Arequipa", "Ayacucho", "Cajamarca", "Callao", "Cusco", 
      "Huancavelica", "Huánuco", "Ica", "Junín", "La Libertad", "Lambayeque", "Lima", "Loreto", 
      "Madre de Dios", "Moquegua", "Pasco", "Piura", "Puno", "San Martín", "Tacna", "Tumbes", "Ucayali"
    ]
  },
  {
    name: "Egypt",
    code: "20",
    states: [
      "Alexandria", "Aswan", "Asyut", "Beheira", "Beni Suef", "Cairo", "Dakahlia", "Damietta", 
      "Faiyum", "Gharbia", "Giza", "Ismailia", "Kafr el-Sheikh", "Luxor", "Matruh", "Minya", 
      "Monufia", "New Valley", "North Sinai", "Port Said", "Qalyubia", "Qena", "Red Sea", 
      "Sharqia", "Sohag", "South Sinai", "Suez"
    ]
  },
  {
    name: "Turkey",
    code: "90",
    states: [
      "Adana", "Ankara", "Antalya", "Balikesir", "Bursa", "Denizli", "Diyarbakir", "Erzurum", 
      "Eskisehir", "Gaziantep", "Hatay", "Istanbul", "Izmir", "Kayseri", "Kocaeli", "Konya", 
      "Malatya", "Manisa", "Mardin", "Mersin", "Mugla", "Samsun", "Sanliurfa", "Tekirdag", "Trabzon"
    ]
  },
  {
    name: "Philippines",
    code: "63",
    states: [
      "Metro Manila", "Abra", "Agusan", "Aklan", "Albay", "Antique", "Apayao", "Aurora", "Basilan", 
      "Bataan", "Batanes", "Batangas", "Benguet", "Biliran", "Bohol", "Bukidnon", "Bulacan", "Cagayan", 
      "Camarines", "Camiguin", "Capiz", "Catanduanes", "Cavite", "Cebu", "Cotabato", "Davao", 
      "Guimaras", "Ifugao", "Ilocos Norte", "Ilocos Sur", "Iloilo", "Isabela", "Kalinga", "La Union", 
      "Laguna", "Lanao", "Leyte", "Maguindanao", "Marinduque", "Masbate", "Misamis", "Mountain Province", 
      "Negros", "Nueva Ecija", "Nueva Vizcaya", "Palawan", "Pampanga", "Pangasinan", "Quezon", "Quirino", 
      "Rizal", "Romblon", "Samar", "Sarangani", "Siquijor", "Sorsogon", "Sultan Kudarat", "Sulu", 
      "Surigao", "Tarlac", "Tawi-Tawi", "Zambales", "Zamboanga"
    ]
  },
  {
    name: "Vietnam",
    code: "84",
    states: [
      "An Giang", "Ba Ria-Vung Tau", "Bac Giang", "Bac Kan", "Bac Lieu", "Bac Ninh", "Ben Tre", 
      "Binh Dinh", "Binh Duong", "Binh Phuoc", "Binh Thuan", "Ca Mau", "Can Tho", "Cao Bang", 
      "Da Nang", "Dak Lak", "Dak Nong", "Dien Bien", "Dong Nai", "Dong Thap", "Gia Lai", "Ha Giang", 
      "Ha Nam", "Ha Noi", "Ha Tinh", "Hai Duong", "Hai Phong", "Hau Giang", "Ho Chi Minh City", 
      "Hoa Binh", "Hung Yen", "Khanh Hoa", "Kien Giang", "Kon Tum", "Lai Chau", "Lam Dong", 
      "Lang Son", "Lao Cai", "Long An", "Nam Dinh", "Nghe An", "Ninh Binh", "Ninh Thuan", "Phu Tho", 
      "Phu Yen", "Quang Binh", "Quang Nam", "Quang Ngai", "Quang Ninh", "Quang Tri", "Soc Trang", 
      "Son La", "Tay Ninh", "Thai Binh", "Thai Nguyen", "Thanh Hoa", "Thua Thien Hue", "Tien Giang", 
      "Tra Vinh", "Tuyên Quang", "Vinh Long", "Vinh Phuc", "Yen Bai"
    ]
  },
  {
    name: "Thailand",
    code: "66",
    states: [
      "Bangkok", "Chiang Mai", "Chiang Rai", "Chon Buri", "Chumphon", "Kalasin", "Kanchanaburi", 
      "Khon Kaen", "Krabi", "Lampang", "Lamphun", "Mae Hong Son", "Nakhon Nayok", "Nakhon Pathom", 
      "Nakhon Ratchasima", "Nakhon Sawan", "Nakhon Si Thammarat", "Nonthaburi", "Pathum Thani", 
      "Phangnga", "Phatthalung", "Phayao", "Phetchaburi", "Phetchabun", "Phitsanulok", "Phuket", 
      "Prachin Buri", "Prachuap Khiri Khan", "Ranong", "Ratchaburi", "Rayong", "Roi Et", "Sa Kaeo", 
      "Sakon Nakhon", "Samut Prakan", "Samut Sakhon", "Samut Songkhram", "Saraburi", "Satun", 
      "Sing Buri", "Songkhla", "Sukhothai", "Suphan Buri", "Surat Thani", "Surin", "Tak", "Trang", 
      "Trat", "Ubon Ratchathani", "Udon Thani", "Yala", "Yasothon"
    ]
  },
  {
    name: "Malaysia",
    code: "60",
    states: [
      "Johor", "Kedah", "Kelantan", "Kuala Lumpur", "Labuan", "Malacca", "Negeri Sembilan", 
      "Pahang", "Penang", "Perak", "Perlis", "Putrajaya", "Sabah", "Sarawak", "Selangor", 
      "Terengganu"
    ]
  },
  {
    name: "Indonesia",
    code: "62",
    states: [
      "Aceh", "Bali", "Banten", "Bengkulu", "Gorontalo", "Jakarta", "Jambi", "West Java", 
      "Central Java", "East Java", "West Kalimantan", "Central Kalimantan", "South Kalimantan", 
      "East Kalimantan", "North Kalimantan", "Bangka Belitung", "Riau Islands", "Lampung", 
      "Maluku", "North Maluku", "West Nusa Tenggara", "East Nusa Tenggara", "Papua", "West Papua", 
      "Riau", "West Sulawesi", "South Sulawesi", "Central Sulawesi", "North Sulawesi", 
      "Southeast Sulawesi", "West Sumatra", "South Sumatra", "North Sumatra", "Yogyakarta"
    ]
  },
  {
    name: "Pakistan",
    code: "92",
    states: [
      "Balochistan", "Khyber Pakhtunkhwa", "Punjab", "Sindh", "Islamabad Capital Territory", 
      "Azad Kashmir", "Gilgit-Baltistan"
    ]
  },
  {
    name: "Poland",
    code: "48",
    states: [
      "Greater Poland", "Kuyavian-Pomeranian", "Lesser Poland", "Łódź", "Lower Silesian", 
      "Lublin", "Lubusz", "Masovian", "Opole", "Podlaskie", "Pomeranian", "Silesian", 
      "Subcarpathian", "Holy Cross", "Warmian-Masurian", "West Pomeranian"
    ]
  },
  {
    name: "Portugal",
    code: "351",
    states: [
      "Lisbon", "Porto", "Braga", "Setúbal", "Aveiro", "Faro", "Leiria", "Coimbra", 
      "Santarém", "Viseu", "Madeira", "Azores"
    ]
  },
  {
    name: "Greece",
    code: "30",
    states: [
      "Attica", "Central Greece", "Central Macedonia", "Crete", "Eastern Macedonia and Thrace", 
      "Epirus", "Ionian Islands", "North Aegean", "Peloponnese", "South Aegean", "Thessaly", 
      "West Greece", "West Macedonia"
    ]
  },
  {
    name: "Russia",
    code: "7",
    states: ["Moscow", "Saint Petersburg", "Novosibirsk", "Yekaterinburg", "Nizhny Novgorod", "Kazan", "Chelyabinsk", "Omsk", "Samara", "Rostov-on-Don"]
  },
  {
    name: "Ukraine",
    code: "380",
    states: ["Kyiv", "Kharkiv", "Odesa", "Dnipro", "Zaporizhzhia", "Lviv", "Kryvyi Rih", "Mykolaiv", "Vinnytsia", "Poltava"]
  }
];
