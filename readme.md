### MyS — Система управления проектами  

## Команда:
- Арехов Артём  
- Гуляева Анастасия  
- Ларин Александр  
- Прудникова Светлана  

---

### **1. Цель проекта:**  
Создание веб-приложения для управления проектами, предназначенного для предоставления пользователям возможности создавать, редактировать, отслеживать статус и делиться проектами с другими пользователями. Проект представляет собой модель реального проекта, позволяя подробно описывать все происходящие в нем процессы. Функционал включает возможность добавления чек-листов, текстового описания, изображений, фотографий, сохранения ссылок, а также изменения и отображения текущего статуса проекта.  

---

### **2. Основные функции:**  

#### **2.1 Страница со списком доступных проектов:**

- **Отображение списка проектов:**
  - **Мои проекты** – проекты, созданные пользователем.  
  - **Доступные проекты** – проекты, к которым пользователь получил доступ от других участников.  
- **Карточки проектов включают:**
  - Название проекта.  
  - Индикатор статуса проекта (например, активен, в архиве и т.д.) – отображается в виде кружка в левом верхнем углу карточки.  
  - Краткое описание проекта.  
- **Функционал страницы:**
  - Возможность создания нового проекта через иконку «+».  
  - Доступ к боковому меню, которое включает:
    - Кнопку перехода ко всем проектам (текущая страница).  
    - Доступ к настройкам.  
    - Доступ к информации о пользователе.  


#### **2.2 Страница проекта:**

- Проект, состоит из блоков:
   - Описание проекта - один блок на весь проект  
      - **Название (заголовок)**  
      - **Статус проекта**.  
      - **Краткое описание**.  
      - **Полное описание**.  
   - Следующие блоки могут создаваться более одного раза  
      - Блок списка задач (с чекбоксами для выполнения).  
      - Блок с изображением  
      - Блок с внешними ссылками.  
      - Блоки с текстовой информацией.  


#### **2.3 Страница информации о профиле:**
   - Имя пользователя
   - Уникальный логин пользователя
   - Информация о пользователе
   - Аватар пользователя
   - Модальное окно с возможностью изменения всей информации


#### **2.4 Стартовая страница:**  
   - Кнопка регистрации
   - Кнопка входа


#### **2.5 Страница входа/регистрации:**  
   - Поля ввода данных
   - Кнопка действия (входа/регистрации)


#### **2.6 Страница настроек:**  
   - Поля изменения доступа к аккаунту (почта/пароль)
   - Изменение тем (темная/светлая)



### **3. Функциональные требования:**  
1. **Система регистрации и аутентификации**:
   - Авторизация через логин и пароль.  
2. **Управление проектами**:
   - CRUD-операции (создание, чтение, обновление, удаление) для проектов.  
   - Добавление и удаление задач внутри проекта.
   - Добавлнеие и изменение блоков проектов  
3. **Доступ к проектам**:
   - Возможность делиться проектами с другими пользователями.  
4. **Визуализация данных**:
   - Простая и интуитивно понятная структура страниц.  
   - Минималистичный дизайн с акцентом на удобство работы.  

---

### **4. Технологический стек:**  

---
**Frontend**: html+css+js, jQuery 3.7.1, Bootstrap 5, html тег iframe  
**Backend**: yii 2, php 8.1, MySQL, 8.0, Apache
