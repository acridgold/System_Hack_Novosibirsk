// ===== РЕКОМЕНДАЦИИ (расширенный список) =====
export const MOCK_RECOMMENDATIONS = [
    // === Существующие (1–6) ===
    {
        id: 1,
        category: 'Медитация',
        title: 'Практикуйте осознанность',
        description: 'Уделяйте 10 минут в день медитации или дыхательным упражнениям для снижения стресса',
        completed: true,
        link: "https://habr.com/ru/articles/452966/",
    },
    {
        id: 2,
        category: 'Тайм-менеджмент',
        title: 'Используйте технику Pomodoro',
        description: 'Работайте 25 минут, затем делайте 5-минутный перерыв для повышения концентрации',
        completed: true,
        link: "https://www.unisender.com/ru/blog/pomodoro-metod-i-tekhnika-tajm-menedzhmenta/",
    },
    {
        id: 3,
        category: 'Физическая активность',
        title: 'Регулярные упражнения',
        description: 'Занимайтесь физической активностью минимум 3 раза в неделю по 30 минут',
        completed: false,
        link: "https://habr.com/ru/companies/sportmaster_lab/articles/663628/",
    },
    {
        id: 4,
        category: 'Сон',
        title: 'Соблюдайте режим сна',
        description: 'Ложитесь спать и просыпайтесь в одно и то же время, спите 7-8 часов',
        completed: true,
        link: "https://habr.com/ru/articles/792600/"
    },
    {
        id: 5,
        category: 'Питание',
        title: 'Сбалансированное питание',
        description: 'Включайте в рацион больше овощей, фруктов, избегайте переработанных продуктов',
        completed: false,
        link: "https://habr.com/ru/articles/721796/",
    },
    {
        id: 6,
        category: 'Социальные связи',
        title: 'Общайтесь с близкими',
        description: 'Проводите время с семьей и друзьями, делитесь переживаниями',
        completed: false,
        link: "https://www.youtube.com/watch?v=-L7vxOtDheU",
    },

    // === Новые рекомендации (7–106) ===
    {
        id: 7,
        category: 'Благодарность',
        title: 'Ведите дневник благодарности',
        description: 'Каждый вечер записывайте три вещи, за которые вы благодарны — повышает уровень счастья и снижает депрессию',
        completed: false,
        link: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10393216/"
    },
    {
        id: 8,
        category: 'Природа',
        title: 'Проводите время на свежем воздухе',
        description: 'Минимум 120 минут в неделю в парке или лесу снижают стресс и улучшают настроение',
        completed: true,
        link: "https://www.nature.com/articles/s41598-019-44097-3"
    },
    {
        id: 9,
        category: 'Чтение',
        title: 'Читайте художественную литературу',
        description: '30 минут чтения в день развивают эмпатию и защищают от когнитивного衰шения',
        completed: false,
        link: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5105607/"
    },
    {
        id: 10,
        category: 'Ведение дневника',
        title: 'Практикуйте экспрессивное письмо',
        description: '15 минут записи эмоций снижают тревогу и улучшают психическое здоровье',
        completed: true,
        link: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8935176/"
    },
    {
        id: 11,
        category: 'Саморазвитие',
        title: 'Учитесь новому еженедельно',
        description: 'Освоение навыков (язык, хобби) повышает удовлетворённость жизнью',
        completed: false,
        link: "https://www.forbes.com/sites/tracybrower/2021/10/17/learning-is-a-sure-path-to-happiness-science-proves-it/"
    },
    {
        id: 12,
        category: 'Волонтерство',
        title: 'Помогайте другим',
        description: 'Волонтёрство раз в месяц усиливает чувство цели и снижает депрессию',
        completed: false,
        link: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10159229/"
    },
    {
        id: 13,
        category: 'Дыхание',
        title: 'Практикуйте диафрагмальное дыхание',
        description: '3–5 минут глубокого дыхания снижают уровень кортизола',
        completed: true,
        link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5455070/"
    },
    {
        id: 14,
        category: 'Гидратация',
        title: 'Пейте достаточно воды',
        description: '2–3 литра воды в день улучшают когнитивные функции и настроение',
        completed: false,
        link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7769896/"
    },
    {
        id: 15,
        category: 'Смех',
        title: 'Смейтесь чаще',
        description: 'Просмотр комедий или общение с юмористами снижает стресс и укрепляет иммунитет',
        completed: true,
        link: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6125057/"
    },
    {
        id: 16,
        category: 'Музыка',
        title: 'Слушайте любимую музыку',
        description: '30 минут музыки в день снижают тревогу и повышают дофамин',
        completed: false,
        link: "https://www.nature.com/articles/s41598-019-51504-8"
    },
    {
        id: 17,
        category: 'Танцы',
        title: 'Танцуйте под музыку',
        description: 'Танцы 2–3 раза в неделю улучшают настроение и координацию',
        completed: false,
        link: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6710495/"
    },
    {
        id: 18,
        category: 'Игры',
        title: 'Играйте в настольные игры',
        description: 'Социальные игры с друзьями усиливают когнитивный резерв и радость',
        completed: true,
        link: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6710495/"
    },
    {
        id: 19,
        category: 'Хобби',
        title: 'Занимайтесь творчеством',
        description: 'Рисование, вязание, лепка — снижают стресс и улучшают самооценку',
        completed: false,
        link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9479654/"
    },
    {
        id: 20,
        category: 'Цифровой детокс',
        title: 'Ограничьте экранное время',
        description: 'Не более 2 часов соцсетей в день — улучшает сон и концентрацию',
        completed: false,
        link: "https://www.thelancet.com/journals/lanchi/article/PIIS2352-4642(19)30191-0/fulltext"
    },
    {
        id: 21,
        category: 'Утренняя рутина',
        title: 'Начинайте день с ритуала',
        description: 'Стакан воды + растяжка + план дня = выше продуктивность',
        completed: true,
        link: "https://hbr.org/2018/11/the-right-way-to-start-your-day"
    },
    {
        id: 22,
        category: 'Свет',
        title: 'Получайте утренний свет',
        description: '15 минут на солнце утром регулируют циркадные ритмы',
        completed: false,
        link: "https://www.science.org/doi/10.1126/sciadv.aau8465"
    },
    {
        id: 23,
        category: 'Ходьба',
        title: 'Ходите пешком 10 000 шагов',
        description: 'Ежедневная ходьба снижает риск сердечных заболеваний на 50%',
        completed: false,
        link: "https://www.ahajournals.org/doi/10.1161/CIRCULATIONAHA.118.036788"
    },
    {
        id: 24,
        category: 'Силовые тренировки',
        title: 'Тренируйте мышцы 2 раза в неделю',
        description: 'Силовые упражнения предотвращают саркопению и депрессию',
        completed: true,
        link: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6323511/"
    },
    {
        id: 25,
        category: 'Йога',
        title: 'Практикуйте йогу',
        description: 'Йога 2–3 раза в неделю снижает тревогу и улучшает гибкость',
        completed: false,
        link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5843960/"
    },
    {
        id: 26,
        category: 'Плавание',
        title: 'Плавайте 1–2 раза в неделю',
        description: 'Плавание укрепляет сердце и снижает воспаление',
        completed: false,
        link: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5750608/"
    },
    {
        id: 27,
        category: 'Велосипед',
        title: 'Катайтесь на велосипеде',
        description: '30 минут велопрогулок улучшают когнитивные функции',
        completed: true,
        link: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6722764/"
    },
    {
        id: 28,
        category: 'Растяжка',
        title: 'Растягивайтесь ежедневно',
        description: '5–10 минут растяжки снижают боль в спине и стресс',
        completed: false,
        link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6935327/"
    },
    {
        id: 29,
        category: 'Омега-3',
        title: 'Употребляйте омега-3',
        description: 'Рыба или добавки 2–3 раза в неделю — для мозга и настроения',
        completed: true,
        link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6324500/"
    },
    {
        id: 30,
        category: 'Пробиотики',
        title: 'Поддерживайте микробиом',
        description: 'Кефир, квашеная капуста — улучшают настроение через ось кишечник–мозг',
        completed: false,
        link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6469458/"
    },
    {
        id: 31,
        category: 'Витамин D',
        title: 'Контролируйте уровень витамина D',
        description: 'Недостаток D связан с депрессией — проверяйтесь ежегодно',
        completed: false,
        link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6970300/"
    },
    {
        id: 32,
        category: 'Кофеин',
        title: 'Ограничьте кофеин после 14:00',
        description: 'Поздний кофеин нарушает глубокий сон',
        completed: true,
        link: "https://www.science.org/doi/10.1126/sciadv.aax8282"
    },
    {
        id: 33,
        category: 'Алкоголь',
        title: 'Ограничьте алкоголь',
        description: 'Не более 1 порции в день — защита сна и печени',
        completed: false,
        link: "https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(18)31310-2/fulltext"
    },
    {
        id: 34,
        category: 'Пост',
        title: 'Практикуйте интервальное голодание',
        description: '16:8 режим улучшает метаболизм и когнитивные функции',
        completed: false,
        link: "https://www.nejm.org/doi/full/10.1056/NEJMra1905136"
    },
    {
        id: 35,
        category: 'Зелёный чай',
        title: 'Пейте зелёный чай',
        description: 'L-теанин + кофеин = спокойная концентрация',
        completed: true,
        link: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7083802/"
    },
    {
        id: 36,
        category: 'Температура',
        title: 'Принимайте контрастный душ',
        description: 'Чередование горячей и холодной воды укрепляет иммунитет',
        completed: false,
        link: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5025014/"
    },
    {
        id: 37,
        category: 'Сауна',
        title: 'Посещайте сауну',
        description: '2–3 раза в неделю снижают риск деменции на 65%',
        completed: true,
        link: "https://academic.oup.com/ageing/article/46/2/245/2654231"
    },
    {
        id: 38,
        category: 'Массаж',
        title: 'Делайте самомассаж',
        description: '5 минут массажа шеи и плеч снижают напряжение',
        completed: false,
        link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6519566/"
    },
    {
        id: 39,
        category: 'Ароматерапия',
        title: 'Используйте лаванду',
        description: 'Аромат лаванды перед сном улучшает качество сна',
        completed: true,
        link: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4505755/"
    },
    {
        id: 40,
        category: 'Животные',
        title: 'Общайтесь с животными',
        description: '15 минут с собакой или кошкой снижают кортизол',
        completed: false,
        link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7401618/"
    },
    {
        id: 41,
        category: 'Садоводство',
        title: 'Занимайтесь садоводством',
        description: 'Уход за растениями снижает депрессию и улучшает микробиом',
        completed: true,
        link: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6334070/"
    },
    {
        id: 42,
        category: 'Пение',
        title: 'Пойте в хоре или дома',
        description: 'Пение высвобождает эндорфины и укрепляет социальные связи',
        completed: false,
        link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6525970/"
    },
    {
        id: 43,
        category: 'Медитация любящей доброты',
        title: 'Практикуйте метту',
        description: 'Желание добра себе и другим повышает эмпатию',
        completed: false,
        link: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6171134/"
    },
    {
        id: 44,
        category: 'Цели',
        title: 'Ставьте SMART-цели',
        description: 'Чёткие цели повышают мотивацию и успех',
        completed: true,
        link: "https://psycnet.apa.org/record/1982-25854-001"
    },
    {
        id: 45,
        category: 'Визуализация',
        title: 'Визуализируйте успех',
        description: '5 минут визуализации утром повышают уверенность',
        completed: false,
        link: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5959026/"
    },
    {
        id: 46,
        category: 'Самосострадание',
        title: 'Практикуйте самосострадание',
        description: 'Доброта к себе при неудачах снижает тревогу',
        completed: true,
        link: "https://self-compassion.org/the-research/"
    },
    {
        id: 47,
        category: 'Границы',
        title: 'Учитесь говорить "нет"',
        description: 'Здоровые границы снижают выгорание',
        completed: false,
        link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6796222/"
    },
    {
        id: 48,
        category: 'Финансы',
        title: 'Ведите учёт расходов',
        description: 'Финансовая осознанность снижает стресс',
        completed: false,
        link: "https://www.apa.org/pubs/journals/releases/fam-fam0000708.pdf"
    },
    {
        id: 49,
        category: 'Обучение',
        title: 'Смотрите образовательные видео',
        description: '15 минут TED или курсов в день — рост знаний',
        completed: true,
        link: "https://www.ted.com"
    },
    {
        id: 50,
        category: 'Языки',
        title: 'Учите иностранный язык',
        description: 'Duolingo 10 минут в день — защита от деменции',
        completed: false,
        link: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5581480/"
    },
    {
        id: 51,
        category: 'Память',
        title: 'Тренируйте память',
        description: 'Метод loci или приложения — улучшают когнитивный резерв',
        completed: false,
        link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4055506/"
    },
    {
        id: 52,
        category: 'Головоломки',
        title: 'Решайте кроссворды или судоку',
        description: 'Когнитивные игры замедляют старение мозга',
        completed: true,
        link: "https://www.nejm.org/doi/full/10.1056/NEJMoa010278"
    },
    {
        id: 53,
        category: 'Сон днём',
        title: 'Спите днём 10–20 минут',
        description: 'Короткий сон восстанавливает внимание',
        completed: false,
        link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6715130/"
    },
    {
        id: 54,
        category: 'Темнота',
        title: 'Спите в полной темноте',
        description: 'Блокировка света улучшает мелатонин и сон',
        completed: true,
        link: "https://www.jcircadianrhythms.com/articles/10.5334/jcr.190"
    },
    {
        id: 55,
        category: 'Тишина',
        title: 'Практикуйте тишину',
        description: '10 минут тишины в день снижают давление',
        completed: false,
        link: "https://heart.bmj.com/content/92/10/1319"
    },
    {
        id: 56,
        category: 'Лесные ванны',
        title: 'Практикуйте шинрин-ёку',
        description: 'Прогулки в лесу снижают кортизол на 16%',
        completed: true,
        link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4997396/"
    },
    {
        id: 57,
        category: 'Море',
        title: 'Слушайте звуки моря',
        description: 'Звуки волн активируют парасимпатическую систему',
        completed: false,
        link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6628559/"
    },
    {
        id: 58,
        category: 'Цветы',
        title: 'Окружайте себя цветами',
        description: 'Цветы в доме повышают настроение и креативность',
        completed: false,
        link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9012702/"
    },
    {
        id: 59,
        category: 'Минимализм',
        title: 'Уберите лишнее',
        description: 'Меньше вещей = больше спокойствия',
        completed: true,
        link: "https://www.jneb.org/article/S1499-4046(19)30806-8/fulltext"
    },
    {
        id: 60,
        category: 'Благодарность письмом',
        title: 'Напишите благодарственное письмо',
        description: 'Одно письмо в месяц усиливает счастье на 2 месяца',
        completed: false,
        link: "https://psycnet.apa.org/doi/10.1037/0022-3514.84.1.158"
    },
    {
        id: 61,
        category: 'Добрые дела',
        title: 'Совершайте акты доброты',
        description: '5 добрых дел в неделю повышают благополучие',
        completed: true,
        link: "https://psycnet.apa.org/doi/10.1037/pspi0000035"
    },
    {
        id: 62,
        category: 'Прощение',
        title: 'Практикуйте прощение',
        description: 'Отпускание обид снижает гнев и давление',
        completed: false,
        link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5055412/"
    },
    {
        id: 63,
        category: 'Смехотерапия',
        title: 'Смотрите стендап',
        description: '30 минут смеха = снижение воспаления',
        completed: true,
        link: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6125057/"
    },
    {
        id: 64,
        category: 'Игры с детьми',
        title: 'Играйте с детьми',
        description: 'Игра возвращает в состояние потока',
        completed: false,
        link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6669299/"
    },
    {
        id: 65,
        category: 'Путешествия',
        title: 'Путешествуйте хотя бы раз в год',
        description: 'Новизна стимулирует нейропластичность',
        completed: false,
        link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7223203/"
    },
    {
        id: 66,
        category: 'Фотография',
        title: 'Фотографируйте красоту',
        description: 'Поиск красоты в обыденном повышает осознанность',
        completed: true,
        link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5089962/"
    },
    {
        id: 67,
        category: 'Книги по психологии',
        title: 'Читайте "Поток" Михая Чиксентмихайи',
        description: 'Понимание потока помогает жить осознанно',
        completed: false,
        link: "https://www.goodreads.com/book/show/66354.Flow"
    },
    {
        id: 68,
        category: 'Книги по привычкам',
        title: 'Читайте "Атомные привычки"',
        description: 'Маленькие изменения = большие результаты',
        completed: true,
        link: "https://jamesclear.com/atomic-habits"
    },
    {
        id: 69,
        category: 'Книги по сну',
        title: 'Читайте "Почему мы спим"',
        description: 'Понимание сна мотивирует его ценить',
        completed: false,
        link: "https://www.simonandschuster.com/books/Why-We-Sleep/Matthew-Walker/9781501144325"
    },
    {
        id: 70,
        category: 'Подкасты',
        title: 'Слушайте подкасты по саморазвитию',
        description: '15 минут в день = новые идеи',
        completed: true,
        link: "https://www.hubermanlab.com"
    },
    {
        id: 71,
        category: 'Медитация на ходу',
        title: 'Практикуйте ходьбу с осознанностью',
        description: 'Сосредоточьтесь на шагах — снижает тревогу',
        completed: false,
        link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5332915/"
    },
    {
        id: 72,
        category: 'Дыхание 4-7-8',
        title: 'Дышите по методу 4-7-8',
        description: '4 вдох — 7 задержка — 8 выдох = быстрое успокоение',
        completed: true,
        link: "https://www.drweil.com/health-wellness/body-mind-spirit/stress-anxiety/breathing-4-7-8/"
    },
    {
        id: 73,
        category: 'Холод',
        title: 'Практикуйте холодовые ванны',
        description: '3 минуты в холодной воде повышают дофамин на 250%',
        completed: false,
        link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9519420/"
    },
    {
        id: 74,
        category: 'Тепло',
        title: 'Грейтесь в тепле',
        description: 'Тёплая ванна вечером улучшает засыпание',
        completed: true,
        link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6011838/"
    },
    {
        id: 75,
        category: 'Светотерапия',
        title: 'Используйте лампу 10 000 люкс',
        description: 'Особенно зимой в Финляндии — против SAD',
        completed: false,
        link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6746555/"
    },
    {
        id: 76,
        category: 'Заземление',
        title: 'Ходите босиком по земле',
        description: 'Заземление снижает воспаление',
        completed: false,
        link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4378297/"
    },
    {
        id: 77,
        category: 'Объятия',
        title: 'Обнимайтесь 20 секунд',
        description: 'Долгие объятия высвобождают окситоцин',
        completed: true,
        link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3183515/"
    },
    {
        id: 78,
        category: 'Комплименты',
        title: 'Делайте искренние комплименты',
        description: 'Комплименты повышают счастье дающего',
        completed: false,
        link: "https://psycnet.apa.org/doi/10.1037/pspi0000099"
    },
    {
        id: 79,
        category: 'Слушание',
        title: 'Практикуйте активное слушание',
        description: 'Полное внимание собеседнику укрепляет связи',
        completed: true,
        link: "https://hbr.org/2016/05/what-great-listeners-actually-do"
    },
    {
        id: 80,
        category: 'Рефлексия',
        title: 'Проводите еженедельный обзор',
        description: 'Что прошло хорошо? Что улучшить?',
        completed: false,
        link: "https://positivepsychology.com/weekly-review/"
    },
    {
        id: 81,
        category: 'Фокус',
        title: 'Практикуйте одно задание за раз',
        description: 'Монотаскинг повышает эффективность на 40%',
        completed: true,
        link: "https://www.apa.org/pubs/journals/releases/xge-133-4-579.pdf"
    },
    {
        id: 82,
        category: 'Отдых',
        title: 'Планируйте "ничего не делание"',
        description: '30 минут без планов восстанавливают энергию',
        completed: false,
        link: "https://www.npr.org/sections/health-shots/2021/01/04/953373864/why-doing-nothing-is-one-of-the-most-important-things-you-can-do"
    },
    {
        id: 83,
        category: 'Смех над собой',
        title: 'Смейтесь над своими ошибками',
        description: 'Юмор над неудачами снижает стресс',
        completed: true,
        link: "https://psycnet.apa.org/doi/10.1037/0022-3514.92.6.1084"
    },
    {
        id: 84,
        category: 'Дыхание в коробке',
        title: 'Дышите по схеме "коробка"',
        description: '4-4-4-4 — выравнивает нервную систему',
        completed: false,
        link: "https://www.medicalnew doctrines.com/article/S0735-6757(18)30376-2/fulltext"
    },
    {
        id: 85,
        category: 'Тайм-блокинг',
        title: 'Планируйте день блоками',
        description: 'Чёткие временные рамки повышают продуктивность',
        completed: true,
        link: "https://hbr.org/2018/12/how-timeboxing-works-and-why-it-will-make-you-more-productive"
    },
    {
        id: 86,
        category: 'Правило 2 минут',
        title: 'Если задача < 2 минут — делайте сразу',
        description: 'Устраняет накопление мелочей',
        completed: false,
        link: "https://davidallen.co/two-minute-rule/"
    },
    {
        id: 87,
        category: 'Эффект Зейгарник',
        title: 'Оставляйте задачи незавершёнными',
        description: 'Незавершённое лучше запоминается',
        completed: false,
        link: "https://psycnet.apa.org/record/1927-01199-001"
    },
    {
        id: 88,
        category: 'Правило 80/20',
        title: 'Фокусируйтесь на 20% задач',
        description: '20% усилий дают 80% результата',
        completed: true,
        link: "https://www.investopedia.com/terms/1/80-20-rule.asp"
    },
    {
        id: 89,
        category: 'Медитация сканирования тела',
        title: 'Сканируйте тело осознанно',
        description: 'Снижает хроническую боль и тревогу',
        completed: false,
        link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5679245/"
    },
    {
        id: 90,
        category: 'Стоицизм',
        title: 'Читайте Марка Аврелия',
        description: '«Размышления» учат спокойствию',
        completed: false,
        link: "https://www.gutenberg.org/files/15877/15877-h/15877-h.htm"
    },
    {
        id: 91,
        category: 'Эпикур',
        title: 'Практикуйте умеренные удовольствия',
        description: 'Простые радости — основа счастья',
        completed: true,
        link: "https://www.britannica.com/biography/Epicurus"
    },
    {
        id: 92,
        category: 'Мифы о продуктивности',
        title: 'Не верьте в многозадачность',
        description: 'Многозадачность снижает IQ на 10 пунктов',
        completed: false,
        link: "https://www.apa.org/pubs/journals/releases/xlm-30410.pdf"
    },
    {
        id: 93,
        category: 'Дофамин-детокс',
        title: 'Практикуйте дофамин-детокс',
        description: 'День без стимулов возвращает чувствительность к радости',
        completed: false,
        link: "https://www.healthline.com/health/mental-health/dopamine-detox"
    },
    {
        id: 94,
        category: 'Солнечные прогулки',
        title: 'Гуляйте на солнце в обед',
        description: 'Свет в середине дня регулирует циркадные ритмы',
        completed: true,
        link: "https://www.jcircadianrhythms.com/articles/10.5334/jcr.189/"
    },
    {
        id: 95,
        category: 'Зимняя активность',
        title: 'Занимайтесь зимними видами спорта',
        description: 'Лыжи, коньки — особенно полезны в Финляндии',
        completed: false,
        link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7277586/"
    },
    {
        id: 96,
        category: 'Сезонные продукты',
        title: 'Ешьте местные сезонные продукты',
        description: 'Свежие ягоды, грибы — больше антиоксидантов',
        completed: true,
        link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7019716/"
    },
    {
        id: 97,
        category: 'Сауна + холод',
        title: 'Чередуйте сауну и холодный душ',
        description: 'Контраст усиливает пользу для сосудов',
        completed: false,
        link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5025014/"
    },
    {
        id: 98,
        category: 'Скандинавский уют',
        title: 'Практикуйте хюгге',
        description: 'Свечи, чай, плед — уют повышает благополучие',
        completed: true,
        link: "https://www.penguinrandomhouse.com/books/533897/the-little-book-of-hygge-by-meik-wiking/"
    },
    {
        id: 99,
        category: 'Финская сису',
        title: 'Развивайте сису',
        description: 'Стойкость и упорство — ключ к преодолению',
        completed: false,
        link: "https://www.sisu-book.com"
    },
    {
        id: 100,
        category: 'Природа Финляндии',
        title: 'Посещайте национальные парки',
        description: 'Nuuksio, Oulanka — природа лечит душу',
        completed: true,
        link: "https://www.nationalparks.fi"
    }
];