# Bagira Planner Workspace Rules

- **Mobile First**: Всі UI компоненти розробляються в першу чергу з розрахунком на мобільні екрани (Touch Targets від 44px, зручні дно-шторки Bottom Sheet).
- **Time Calculations**: Всі розрахунки часу враховують буферний час послуги (`bufferMinutes`) для дезінфекції та прибирання.
- **Supabase Synchronization**: Використовувати комбінацію оновлень стану в пам'яті (Zustand/Store) з асинхронним збереженням у Supabase.
