export default translations = {
  en: {
    appNavigator: {
      commission: "Commission amount:",
      tokens: "Tokens:",
      balance: "Balance:",
      PasswordGeneration: "Generate password",
      HomeScreen: "Passwords",
      AboutScreen: "About",
      License: "License",
      AdminPanel: "Admin Panel",
      downloadPasswords: "Export all passwords?",
      skip: "Skip",
    },
    login: {
      masterPassword: "Master Password",
      loginBtn: "Confirm",
      resetLocalData: {
        btn: "Reset keys",
        title: "Are you sure?",
        description:
          "Resetting your keys will result in you losing access to your passwords forever.",
        cancel: "Cancel",
      },
      loginPageDescription:
        "The Master Password is a unique combination of characters that you create to ensure the security of your personal information in the application.",
    },
    connectWallet: {
      infoModalTitle: "Correct smart contract",
      error: {
        title: "An error occurred.",
        description: "Incorrect data.",
      },
      mainBtn: "Connect wallet",
      newMainBtn: "Connect a new wallet",
      switchBtn: "Switch wallet",
      privateKey: "Private key",
      userAddress: "Wallet Address",
      contractAddress: "Smart contract address",
      networkName: "Network name",
      addNewWalletForm: "New wallet",
    },
    addForm: {
      nameTitleErr: "Write a title",
      nameTitle: "Title",
      selectBtn: "Select category",
      name: "Name",
      search: "Search",
      link: "Link to site",
      login: "Login",
      password: "Password",
      bankOwnerName: "Cardholder name",
      bankAddInfo: "Additional information",
      bankName: "Bank name",
      bankTel: "Customer service telephone number",
      bankMailAdress: "Bank postal address",
      addBtn: "Add",
      number: "Number",
    },
    adminPanel: {
      confirmBtn: "Confirm",
      addTokensTitle: "Add tokens",
      recipientAddress: "Recipient address",
      currentRecipientAddress: "Current address:",
      changeCommissionSize: "Change commission size",
      changeCommissionRecipient: "Change commission recipient address",
      commissionRecipientAddress: "Commission recipient address",
      cost: "Cost of 1st byte",
      sum: "Amount",
      successMessage: "Successful",
    },
    documentPickerBotton: {
      upload: "Upload file",
    },
    homeScreen: {
      errorMessage: {
        err1: "Reduce the amount of data being changed/added",
        err2: "No data to update",
        err3: "Reduce the amount of data being changed. Now the gas ratio is:",
        err4: "Reduce the amount of data removed. The gas ratio is now:",
        err5: `You need `,
        err5_1: ` your account has `,
        err6: "Insufficient funds",
        err7: "Unnecessary data has been removed from the blockchain",
        err8: "An error occurred when deleting unnecessary data from the blockchain",
        err9: "Data saved",
        err10: "A data update error occurred",
        err11: "Reduce data volume",
        err12: "An error occurred",
      },
      openLink: "Open in browser",
      password: "Password:",
      login: "Login:",
      editData: "Edit",
      deleteData: "Delete entry?",
    },
    newCategoryForm: {
      name: "Name of the new category",
      confirmBtn: "Done",
    },
    passwordGeneration: {
      title1: "Generate password",
      placeholder1: "Click on the generate button",

      btn1: "Generate",
      title2: "Check password",
      placeholder2: "Enter password for verification",

      passwordStrength: "Password strength:",
      length: "Length",
      uppercase: "Upper case",
      lowercase: "Lower case",
      numbers: "Numbers",
      symbols: "Symbols",
    },
    selectKeys: {
      selectedPasswords: "Selected passwords:",
      selectAll: "Select all",
    },
    stories: [
      {
        image: require("../assets/faq/chain.png"),
        description: [
          {
            text: "This application is based on smart contracts, ensuring maximum transparency and reliability in storing your passwords.",
          },
          {
            text: "It's important to note that we do not store any passwords on our servers or in centralized databases.",
          },
          {
            text: "Instead, the data is encrypted and stored directly on the blockchain network, where only you have access to it. With the master password, all application data is securely encrypted, which is why it's crucial to create a strong password and ensure its safety.",
          },
        ],
      },
      {
        image: require("../assets/faq/key.png"),
        description: [
          {
            text: "The master password used to access your data is not stored anywhere in our system.",
          },
          {
            text: "This means you are the sole owner of your data and responsible for the security of your master password. Therefore, it's important to keep it in a secure place and not share it with others.",
          },
          {
            text: "Do not disclose your master password to anyone. If a malicious actor obtains it, they can access your data and decrypt it.",
          },
        ],
      },
      {
        caption:
          "You can use the convenient password import feature from your browser, allowing you to quickly and easily transfer your existing account data to the application.",
        image: require("../assets/faq/chrome.png"),
        instruction: [
          {
            text: "1. Go to the browser 'Settings' by clicking on ",
            icon: require("../assets/faq/gear.png"),
          },
          { text: "2. Go to 'Password Manager'" },
          { text: "3. Click on ", icon: require("../assets/faq/gear.png") },
          { text: "4. Click on 'Import Passwords' and download the CSV file" },
          { text: "5. Upload the downloaded CSV file to the application" },
        ],
      },
      {
        image: require("../assets/faq/blockchain.png"),
        description: [
          {
            text: "Blockchain password management represents an innovative approach to managing and storing account data. Here are several advantages that KeyKeeper can offer:",
          },
          {
            title: "Security",
            text: "Blockchain provides a high level of security due to its decentralized nature and cryptographic methods of data storage. Your account data can be protected from unauthorized access and hacker attacks.",
          },
        ],
      },
      {
        image: require("../assets/faq/blockchain.png"),
        description: [
          {
            title: "Decentralization and Reliability",
            text: "Using blockchain allows managing your passwords without the need to trust their storage to a separate organization. This enhances the system's reliability as there is no single point of failure.",
          },
          {
            title: "Transparency and Tamper Resistance",
            text: "Blockchain ensures transparency of operations, meaning you can see the history of changes and access to your data. Additionally, due to the distributed nature of blockchain networks, it's impossible to tamper with data or alter it without proper permissions.",
          },
        ],
      },
      {
        image: require("../assets/faq/blockchain.png"),
        description: [
          {
            title: "Ease of Use",
            text: "Blockchain password managers can provide a convenient and easy way to manage multiple accounts and passwords. You no longer have to remember long passwords or worry about their security.",
          },
          {
            title: "Access from Any Device",
            text: "Since the data is stored on the blockchain, you can access your account data from any internet-connected device. This provides flexibility and mobility in managing your passwords.",
          },
          {
            title: "Enhanced Personal Information Protection",
            text: "Using a blockchain password manager can help protect your personal information from leaks or unauthorized access. Your account data will be stored securely and confidentially.",
          },
        ],
      },
    ],
  },
  fr: {
    appNavigator: {
      commission: "Montant de la commission:",
      tokens: "Jetons:",
      balance: "Solde:",
      PasswordGeneration: "Générer le mot de passe",
      HomeScreen: "Mots de passe",
      AboutScreen: "À propos de l'application",
      License: "Licence",
      AdminPanel: "Panneau d'administration",
      downloadPasswords: "Exporter tous les mots de passe?",
      skip: "Skip",
    },
    login: {
      masterPassword: "Le mot de passe maître",
      loginBtn: "Confirmer",
      resetLocalData: {
        btn: "Réinitialiser les clés",
        title: "Es-tu sûr?",
        description:
          "La réinitialisation de vos clés vous fera perdre définitivement l'accès à vos mots de passe.",
        cancel: "Annuler",
      },
      loginPageDescription:
        "Le mot de passe maître est une combinaison unique de caractères que vous créez pour assurer la sécurité de vos informations personnelles dans l'application.",
    },
    connectWallet: {
      infoModalTitle: "Contrat correct",
      error: {
        title: "Une erreur s'est produite.",
        description: "Données incorrectes.",
      },
      mainBtn: "Connecter le portefeuille",
      newMainBtn: "Connecter un nouveau portefeuille",
      switchBtn: "Changer de portefeuille",
      privateKey: "Clé privée",
      userAddress: "Adresse du portefeuille",
      contractAddress: "Adresse du contrat intelligent",
      networkName: "Nom du réseau",
      addNewWalletForm: "Nouveau portefeuille",
    },
    addForm: {
      nameTitleErr: "Écris le nom",
      nameTitle: "Titre",
      selectBtn: "Sélectionner une catégorie",
      name: "Nom",
      search: "Chercher",
      link: "Lien vers le site",
      login: "Login",
      password: "Mot de passe",
      bankOwnerName: "Nom du titulaire de la carte",
      bankAddInfo: "Informations supplémentaires",
      bankName: "Nom de la banque",
      bankTel: "Numéro de téléphone du service client",
      bankMailAdress: "Adresse postale de la banque",
      addBtn: "Ajouter",
      number: "Nombres",
    },
    adminPanel: {
      confirmBtn: "Confirmer",
      addTokensTitle: "Ajouter des jetons",
      recipientAddress: "Adresse du destinataire",
      currentRecipientAddress: "Adresse actuelle:",
      changeCommissionSize: "Modifier le montant de la commission",
      changeCommissionRecipient:
        "Modifier l'adresse du destinataire de la commission",
      commissionRecipientAddress: "Adresse du destinataire de la commission",
      cost: "Coût du 1er octet",
      sum: "Somme",
      successMessage: "Succès",
    },
    documentPickerBotton: {
      upload: "Télécharger le fichier",
    },
    homeScreen: {
      errorMessage: {
        err1: "Réduire la quantité de données modifiées/ajoutées.",
        err2: "Aucune donnée à mettre à jour",
        err3: "Réduisez la quantité de données modifiées. Maintenant, le ratio de gaz est:",
        err4: "Réduisez la quantité de données supprimées. Le ratio de gaz est maintenant:",
        err5: `Vous avez besoin de `,
        err5_1: ` votre compte a `,
        err6: "Fonds insuffisants",
        err7: "Les données inutiles ont été supprimées de la blockchain",
        err8: "Une erreur s'est produite lors de la suppression des données inutiles de la blockchain",
        err9: "Données enregistrées",
        err10: "Une erreur de mise à jour des données s'est produite",
        err11: "Réduire le volume de données",
        err12: "Une erreur s'est produite",
      },
      openLink: "Ouvrir dans le navigateur",
      password: "Mot de passe:",
      login: "Login:",
      editData: "Modifier",
      deleteData: "Supprimer l'entrée?",
    },
    newCategoryForm: {
      name: "Nom de la nouvelle catégorie",
      confirmBtn: "Terminé",
    },
    passwordGeneration: {
      title1: "Générer un mot de passe",
      placeholder1: "Cliquez sur le bouton générer",

      btn1: "Générer",
      title2: "Vérifier le mot de passe",
      placeholder2: "Entrez le mot de passe pour vérification",

      passwordStrength: "Force du mot de passe:",
      length: "Longueur",
      uppercase: "Majuscule",
      lowercase: "Minuscule",
      numbers: "Nombres",
      symbols: "Symboles",
    },
    selectKeys: {
      selectedPasswords: "Mots de passe sélectionnés :",
      selectAll: "Sélectionner tout",
    },
    stories: [
      {
        image: require("../assets/faq/chain.png"),
        description: [
          {
            text: "Cette application est basée sur des contrats intelligents, garantissant une transparence maximale et une fiabilité dans le stockage de vos mots de passe.",
          },
          {
            text: "Il est important de noter que nous ne stockons aucun mot de passe sur nos serveurs ou dans des bases de données centralisées.",
          },
          {
            text: "Au lieu de cela, les données sont chiffrées et stockées directement sur le réseau blockchain, où vous seul y avez accès. Avec le mot de passe principal, toutes les données de l'application sont sécurisées, c'est pourquoi il est crucial de créer un mot de passe fort et de garantir sa sécurité.",
          },
        ],
      },
      {
        image: require("../assets/faq/key.png"),
        description: [
          {
            text: "Le mot de passe principal utilisé pour accéder à vos données n'est stocké nulle part dans notre système.",
          },
          {
            text: "Cela signifie que vous êtes le seul propriétaire de vos données et responsable de la sécurité de votre mot de passe principal. Il est donc important de le conserver dans un endroit sûr et de ne pas le partager avec d'autres personnes.",
          },
          {
            text: "Ne divulgue pas ton mot de passe principal à qui que ce soit. Si un acteur malveillant l'obtient, il peut accéder à vos données et les décrypter.",
          },
        ],
      },
      {
        caption:
          "Vous pouvez utiliser la fonction pratique d'importation de mots de passe depuis votre navigateur, ce qui vous permet de transférer rapidement et facilement vos données de compte existantes vers l'application.",
        image: require("../assets/faq/chrome.png"),
        instruction: [
          {
            text: "1. Accédez aux 'Paramètres' du navigateur en cliquant sur ",
            icon: require("../assets/faq/gear.png"),
          },
          { text: "2. Allez dans 'Gestionnaire de mots de passe'" },
          { text: "3. Cliquez sur ", icon: require("../assets/faq/gear.png") },
          {
            text: "4. Cliquez sur 'Importer des mots de passe' et téléchargez le fichier CSV",
          },
          {
            text: "5. Téléchargez le fichier CSV téléchargé dans l'application",
          },
        ],
      },
      {
        image: require("../assets/faq/blockchain.png"),
        description: [
          {
            text: "La gestion des mots de passe sur blockchain représente une approche innovante de la gestion et du stockage des données de compte. Voici plusieurs avantages que KeyKeeper peut offrir :",
          },
          {
            title: "Sécurité",
            text: "La blockchain offre un niveau élevé de sécurité en raison de sa nature décentralisée et de ses méthodes cryptographiques de stockage des données. Vos données de compte peuvent être protégées contre l'accès non autorisé et les attaques de pirates informatiques.",
          },
        ],
      },
      {
        image: require("../assets/faq/blockchain.png"),
        description: [
          {
            title: "Décentralisation et Fiabilité",
            text: "L'utilisation de la blockchain permet de gérer vos mots de passe sans avoir besoin de confier leur stockage à une organisation séparée. Cela renforce la fiabilité du système car il n'y a pas de point de défaillance unique.",
          },
          {
            title: "Transparence et Résistance à la falsification",
            text: "La blockchain assure la transparence des opérations, ce qui signifie que vous pouvez voir l'historique des modifications et l'accès à vos données. De plus, grâce à la nature distribuée des réseaux blockchain, il est impossible de falsifier des données ou de les modifier sans les autorisations appropriées.",
          },
        ],
      },
      {
        image: require("../assets/faq/blockchain.png"),
        description: [
          {
            title: "Facilité d'utilisation",
            text: "Les gestionnaires de mots de passe sur blockchain peuvent fournir un moyen pratique et facile de gérer plusieurs comptes et mots de passe. Vous n'avez plus à vous souvenir de longs mots de passe ou à vous soucier de leur sécurité.",
          },
          {
            title: "Accès depuis n'importe quel appareil",
            text: "Étant donné que les données sont stockées sur la blockchain, vous pouvez accéder à vos données de compte depuis n'importe quel appareil connecté à Internet. Cela offre une flexibilité et une mobilité dans la gestion de vos mots de passe.",
          },
          {
            title: "Protection renforcée des informations personnelles",
            text: "L'utilisation d'un gestionnaire de mots de passe sur blockchain peut vous aider à protéger vos informations personnelles contre les fuites ou l'accès non autorisé. Vos données de compte seront stockées en toute sécurité et de manière confidentielle.",
          },
        ],
      },
    ],
  },
  ru: {
    appNavigator: {
      commission: "Размер комиссии:",
      tokens: "Токены:",
      balance: "Баланс:",
      PasswordGeneration: "Сгенерировать пароль",
      HomeScreen: "Пароли",
      AboutScreen: "О приложении",
      License: "Лицензия",
      AdminPanel: "Администратор",
      downloadPasswords: "Скачать все пароли?",
      skip: "Пропустить",
    },
    login: {
      masterPassword: "Мастер-пароль",
      loginBtn: "Подтвердить",
      resetLocalData: {
        btn: "Сбросить ключи",
        title: "Вы уверены?",
        description:
          "Сброс ключей приведет к потере доступа к паролям навсегда.",
        cancel: "Отмена",
      },
      loginPageDescription:
        "Мастер-пароль – это уникальная комбинация символов, которую вы создаете для обеспечения безопасности вашей личной информации в приложении.",
    },
    connectWallet: {
      infoModalTitle: "Корректный смарт-контракт",
      error: {
        title: "Произошла ошибка.",
        description: "Неккоректные данные.",
      },
      mainBtn: "Подключить кошелек",
      newMainBtn: "Подключить новый кошелек",
      switchBtn: "Переключить кошелек",
      privateKey: "Приватный ключ",
      userAddress: "Адрес кошелька",
      contractAddress: "Адрес смарт-контракта",
      networkName: "Название сети",
      addNewWalletForm: "Новый кошелек",
    },
    addForm: {
      nameTitleErr: "Напишите название",
      nameTitle: "Заголовок",
      selectBtn: "Выберите категорию",
      name: "Название",
      search: "Поиск",
      link: "Ссылка на сайт",
      login: "Логин",
      password: "Пароль",
      bankOwnerName: "Имя держателя карты",
      bankAddInfo: "Дополнительная информация",
      bankName: "Название банка",
      bankTel: "Телефон клиентской службы",
      bankMailAdress: "Почтовый адрес банка",
      addBtn: "Добавить",
      number: "Номер",
    },
    adminPanel: {
      confirmBtn: "Подтвердить",
      addTokensTitle: "Начислить токены",
      recipientAddress: "Адрес получателя",
      currentRecipientAddress: "Текущий адрес:",
      changeCommissionSize: "Изменить размер комиссии",
      changeCommissionRecipient: "Изменить адрес получателся комиссии",
      commissionRecipientAddress: "Адресс получателя комиссии",
      cost: "Стоимость 1-го байта",
      sum: "Сумма",
      successMessage: "Успешно",
    },
    documentPickerBotton: {
      upload: "Загрузить файл",
    },
    homeScreen: {
      errorMessage: {
        err1: "Уменьшите объем изменяемых/добавляемых данных.",
        err2: "Нет данных для обновления",
        err3: "Уменьшите объем изменяемых данных. Сейчас соотношение газа:",
        err4: "Уменьшите объем удаляемых данных. Сейчас соотношение газа:",
        err5: `Необходимо `,
        err5_1: ` на вашем счету `,
        err6: "Недостаточно средств",
        err7: "Ненужные данные удалены из блокчейна",
        err8: "Произошла ошибка удаления ненужных данных из блокчейна",
        err9: "Данные сохранены",
        err10: "Произошла ошибка обновления данных",
        err11: "Уменьшите объем данных",
        err12: "Произошла ошибка",
      },
      openLink: "Открыть в браузере",
      password: "Пароль:",
      login: "Логин:",
      editData: "Редактировать данные",
      deleteData: "Удалить запись?",
    },
    newCategoryForm: {
      name: "Название новой категории",
      confirmBtn: "Готово",
    },
    passwordGeneration: {
      title1: "Сгенерировать пароль",
      placeholder1: "Нажмите на кнопку генерации",

      btn1: "Сгенерировать",
      title2: "Проверить пароль",
      placeholder2: "Введите пароль для проверки",

      passwordStrength: "Надежность пароля:",
      length: "Длина",
      uppercase: "Верхний регистр",
      lowercase: "Нижний регистр",
      numbers: "Цифры",
      symbols: "Символы",
    },
    selectKeys: {
      selectedPasswords: "Выбрано паролей:",
      selectAll: "Выбрать все",
    },
    stories: [
      {
        image: require("../assets/faq/chain.png"),
        description: [
          {
            text: "Данное приложение основано на смарт-контрактах, что обеспечивает максимальную прозрачность и надежность хранения ваших паролей. ",
          },
          {
            text: "Важно отметить, что мы не храним никаких паролей на наших серверах или в централизованных базах данных. ",
          },
          {
            text: "Вместо этого, данные шифруются и хранятся непосредственно в сети блокчейн, где доступ к ним имеется только у вас. С помощью мастер-пароля все данные приложения надежно шифруются, именно поэтому так важно придумать надежный пароль и обеспечить его сохранность.",
          },
        ],
      },
      {
        image: require("../assets/faq/key.png"),
        description: [
          {
            text: "Мастер-пароль, используемый для доступа к вашим данным, не сохраняется нигде в нашей системе.",
          },
          {
            text: "Это означает, что вы единственный владелец своих данных и ответственны за безопасность своего мастер-пароля. Поэтому важно сохранить его в надежном месте и не делиться им с посторонними лицами.",
          },
          {
            text: "Никому не сообщайте свой мастер-пароль. Заполучив его злоумышленник сможет получить доступ к вашим данным и расшифровать их.",
          },
        ],
      },
      {
        caption:
          "Вы можете использовать удобную функцию импорта паролей из вашего браузера, это позволит быстро и легко перенести ваши существующие данные учетных записей в приложение.",

        image: require("../assets/faq/chrome.png"),
        instruction: [
          {
            text: "1. Зайдите в «Настройки» браузера, нажав на ",
            icon: require("../assets/faq/gear.png"),
          },
          { text: "2. Зайдите в «Менеджер паролей»" },
          { text: "3. Нажмите на ", icon: require("../assets/faq/gear.png") },
          { text: "4. Нажмите на «Импорт паролей» и скачайте CSV-файл" },
          { text: "5. Загрузите скаченный CSV-файл в приложение" },
        ],
      },
      {
        image: require("../assets/faq/blockchain.png"),
        description: [
          {
            text: "Менеджер паролей на блокчейне представляет собой инновационный подход к управлению и хранению учетных данных. Вот несколько преимуществ, которые KeyKeeper может предложить:",
          },
          {
            title: "Безопасность",
            text: "Блокчейн обеспечивает высокий уровень безопасности за счет своей децентрализованной природы и криптографических методов хранения данных. Ваши учетные данные могут быть защищены от несанкционированного доступа и хакерских атак.",
          },
        ],
      },
      {
        image: require("../assets/faq/blockchain.png"),
        description: [
          {
            title: "Децентрализация и надежность",
            text: "Использование блокчейна позволяет управлять вашими паролями без необходимости доверять их хранение отдельной организации. Это повышает надежность системы, так как нет единой точки отказа.",
          },
          {
            title: "Прозрачность и невозможность подделки",
            text: "Блокчейн обеспечивает прозрачность операций, что означает, что вы можете видеть историю изменений и доступа к вашим данным. Кроме того, благодаря распределенному характеру блокчейн сетей, невозможно подделать данные или изменить их без соответствующих разрешений.",
          },
        ],
      },
      {
        image: require("../assets/faq/blockchain.png"),
        description: [
          {
            title: "Удобство использования",
            text: "Менеджер паролей на блокчейне может предоставить удобный и легкий способ управления множеством учетных записей и паролей. Вам больше не придется запоминать длинные пароли или беспокоиться о их безопасности.",
          },
          {
            title: "Доступ с любого устройства",
            text: "Поскольку данные хранятся в блокчейне, вы можете получить доступ к своим учетным данным с любого устройства, подключенного к интернету. Это обеспечивает гибкость и мобильность в управлении вашими паролями.",
          },
          {
            title: "Повышение защиты личной информации",
            text: "Использование менеджера паролей на блокчейне может помочь вам защитить вашу личную информацию от утечек или нежелательного доступа. Ваши учетные данные будут храниться безопасно и конфиденциально.",
          },
        ],
      },
    ],
  },
};
