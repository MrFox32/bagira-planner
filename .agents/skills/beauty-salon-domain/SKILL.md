---
name: beauty-salon-domain
description: Domain knowledge and workflow rules for beauty salon appointment management, receptionist intake, and client retention.
---

# Beauty Salon Domain Skill

Цей скіл описує доменну логіку та стандарти роботи салону краси Bagira.

## 🔄 Життєвий цикл замовлення (Booking Lifecycle):
1. **Вхід**: Дзвінок від клієнта адміністратору.
2. **Збір інформації**: Мультиселект послуг, розрахунок загального часу та підсумкової ціни.
3. **Підбір вікон**: Генерація оптимальних часових інтервалів через `time-slot-engine`.
4. **Підтвердження**: Вибір вікна та збереження у базі даних.
5. **Статуси**:
   - `pending` (Очікує)
   - `confirmed` (Підтверджено)
   - `in_progress` (В процесі виконанння)
   - `completed` (Успішно завершено)
   - `cancelled` (Скасовано)
