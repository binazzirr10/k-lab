// K-Lab: реальная ежедневная серия. Часовой пояс проекта — Казахстан (Орал).
(function(){
  const timezone='Asia/Oral';

  function todayKey(){
    const parts=new Intl.DateTimeFormat('en-US',{timeZone:timezone,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
    const get=type=>parts.find(x=>x.type===type).value;
    return `${get('year')}-${get('month')}-${get('day')}`;
  }

  function daysBetween(from,to){
    const [fy,fm,fd]=from.split('-').map(Number);
    const [ty,tm,td]=to.split('-').map(Number);
    return Math.round((Date.UTC(ty,tm-1,td)-Date.UTC(fy,fm-1,fd))/86400000);
  }

  async function recordDailyVisit(user){
    const ref=db.collection('users').doc(user.uid);
    const snapshot=await ref.get();
    const data=snapshot.data()||{};
    if(data.role==='admin')return;
    const stats=data.stats||{};
    const today=todayKey();
    const previous=stats.lastActiveDate;
    let next=Number(stats.streak)||0;

    if(previous===today)return;
    if(daysBetween(previous||today,today)===1)next=Math.max(1,next+1);
    else next=1;

    await ref.set({stats:{streak:next,lastActiveDate:today}},{merge:true});
    const streak=document.getElementById('streak');
    if(streak)streak.textContent=next;
    if(typeof renderWeek==='function')renderWeek(next);
  }

  auth.onAuthStateChanged(user=>{if(user)recordDailyVisit(user).catch(error=>console.warn('Streak update failed',error))});
})();
