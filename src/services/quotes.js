export const QUOTES = [
  {
    arabic: 'الَّذِينَ يَأْكُلُونَ الرِّبَا لَا يَقُومُونَ إِلَّا كَمَا يَقُومُ الَّذِي يَتَخَبَّطُهُ الشَّيْطَانُ مِنَ الْمَسِّ',
    translation: 'Those who consume interest cannot stand except as one stands who is being beaten by Satan into insanity.',
    source: 'Quran', ref: 'Surah Al-Baqarah 2:275',
  },
  {
    arabic: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَذَرُوا مَا بَقِيَ مِنَ الرِّبَا',
    translation: 'O you who have believed, fear Allah and give up what remains of interest, if you should be believers.',
    source: 'Quran', ref: 'Surah Al-Baqarah 2:278',
  },
  {
    arabic: 'يَمْحَقُ اللَّهُ الرِّبَا وَيُرْبِي الصَّدَقَاتِ',
    translation: 'Allah destroys interest and gives increase for charities.',
    source: 'Quran', ref: 'Surah Al-Baqarah 2:276',
  },
  {
    arabic: 'وَأَحَلَّ اللَّهُ الْبَيْعَ وَحَرَّمَ الرِّبَا',
    translation: 'Allah has permitted trade and has forbidden interest.',
    source: 'Quran', ref: 'Surah Al-Baqarah 2:275',
  },
  {
    arabic: 'يَا أَيُّهَا الَّذِينَ آمَنُوا لَا تَأْكُلُوا الرِّبَا أَضْعَافًا مُّضَاعَفَةً',
    translation: 'O you who believe, do not consume interest, doubled and multiplied, but fear Allah that you may be successful.',
    source: 'Quran', ref: 'Surah Al-Imran 3:130',
  },
  {
    arabic: 'لَعَنَ رَسُولُ اللَّهِ ﷺ آكِلَ الرِّبَا وَمُوكِلَهُ وَكَاتِبَهُ وَشَاهِدَيْهِ',
    translation: 'The Messenger of Allah ﷺ cursed the one who consumes riba, pays it, writes it and witnesses it — they are all the same.',
    source: 'Hadith', ref: 'Sahih Muslim 1598',
  },
  {
    arabic: 'الرِّبَا سَبْعُونَ حُوبًا، أَيْسَرُهَا أَنْ يَنْكِحَ الرَّجُلُ أُمَّهُ',
    translation: 'Riba has seventy parts, the least of which is as grave as a man committing adultery with his own mother.',
    source: 'Hadith', ref: 'Sunan Ibn Majah 2274',
  },
  {
    arabic: 'دِرْهَمُ رِبًا يَأْكُلُهُ الرَّجُلُ وَهُوَ يَعْلَمُ أَشَدُّ مِنْ سِتَّةٍ وَثَلَاثِينَ زَنْيَةً',
    translation: 'One dirham of riba consumed knowingly is worse than thirty-six acts of adultery.',
    source: 'Hadith', ref: 'Musnad Ahmad',
  },
  {
    arabic: 'مَا أَحَدٌ أَكْثَرَ مِنَ الرِّبَا إِلَّا كَانَ عَاقِبَةُ أَمْرِهِ إِلَى قِلَّةٍ',
    translation: 'No one increases wealth through riba except that their ultimate end will be poverty.',
    source: 'Hadith', ref: 'Sahih Ibn Majah 2279',
  },
];

export function randomQuote() {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}
