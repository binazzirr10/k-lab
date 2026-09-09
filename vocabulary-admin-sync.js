// K-Lab: загружает опубликованные слова, созданные в админ-панели.
// Базовые карточки страницы остаются, новые добавляются к ним.
(function(){
  const categoryMap={
    'Базовые слова':'basic','Люди':'people','Вещи':'things','Еда':'food',
    'Места':'places','Действия':'actions',basic:'basic',people:'people',
    things:'things',food:'food',places:'places',actions:'actions'
  };

  async function addAdminWords(){
    try{
      const snapshot=await db.collection('wordDeck').get();
      snapshot.forEach(doc=>{
        const item=doc.data()||{};
        if(!item.korean||!item.translation)return;
        const id='admin-'+doc.id;
        if(words.some(word=>word.id===id))return;
        words.push({
          id,
          category:categoryMap[item.category]||'basic',
          ko:item.korean,
          ru:item.translation,
          example:item.example||'Добавлено преподавателем K-Lab.'
        });
      });
      render();
    }catch(error){
      console.warn('Не удалось загрузить слова из админ-панели.',error);
    }
  }

  auth.onAuthStateChanged(user=>{if(user)addAdminWords()});
})();
