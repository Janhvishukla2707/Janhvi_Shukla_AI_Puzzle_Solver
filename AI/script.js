let size=3,state=[],chart;

// INIT
function init(){
  size=parseInt(document.getElementById("mode").value);
  state=[...Array(size*size-1).keys()].map(x=>x+1).concat([0]);
  render();
}

// RENDER
function render(){
  const grid=document.getElementById("grid");
  grid.style.gridTemplateColumns=`repeat(${size},80px)`;
  grid.innerHTML='';

  state.forEach((n,i)=>{
    let d=document.createElement('div');
    d.className='tile '+(n===0?'blank':'');
    d.innerText=n||'';
    d.onclick=()=>move(i);
    grid.appendChild(d);
  });
}

// MOVE
function move(i){
  let blank=state.indexOf(0);

  let row=Math.floor(i/size), col=i%size;
  let br=Math.floor(blank/size), bc=blank%size;

  if(Math.abs(row-br)+Math.abs(col-bc)===1){
    [state[i],state[blank]]=[state[blank],state[i]];
    render();
  }
}

// SHUFFLE
function shuffle(){
  for(let i=0;i<200;i++){
    let moves=getMoves(state);
    state=moves[Math.floor(Math.random()*moves.length)];
  }
  render();
}

// GOAL
function isGoal(s){
  return s.join(',') === [...Array(size*size-1).keys()].map(x=>x+1).concat([0]).join(',');
}

// MOVES
function getMoves(s){
  let r=[],b=s.indexOf(0);
  let row=Math.floor(b/size), col=b%size;

  let moves=[];
  if(col>0) moves.push(b-1);
  if(col<size-1) moves.push(b+1);
  if(row>0) moves.push(b-size);
  if(row<size-1) moves.push(b+size);

  for(let x of moves){
    let ns=[...s];
    [ns[x],ns[b]]=[ns[b],ns[x]];
    r.push(ns);
  }
  return r;
}

// HEURISTIC
function h(s){
  let d=0;
  for(let i=0;i<s.length;i++){
    if(s[i]){
      let g=s[i]-1;
      d+=Math.abs(Math.floor(i/size)-Math.floor(g/size)) +
         Math.abs(i%size - g%size);
    }
  }
  return d;
}

// SOLVE
async function solve(type){

  let vis=new Set();
  let q=[[state,[]]];
  let start=performance.now();

  while(q.length){

    let [c,p]=(type==='DFS'?q.pop():q.shift());

    let key=c.join(',');
    if(vis.has(key)) continue;
    vis.add(key);

    if(isGoal(c)){
      let t=Math.floor(performance.now()-start);

      document.getElementById("steps").innerText=p.length;
      document.getElementById("time").innerText=t;

      updateChart(type,p.length,t);
      animate(p);
      return;
    }

    let next=getMoves(c);

    if(type==='A*'){
      next.sort((a,b)=>h(a)-h(b));
    }

    for(let n of next){
      q.push([n,[...p,n]]);
    }
  }
}

// AUTO SOLVE
async function autoSolve(){
  solve('A*');
}

// CHART (FIXED)
function updateChart(alg,steps,time){

  let s = steps===0 ? 1 : steps;
  let t = time===0 ? 1 : time;

  if(chart) chart.destroy();

  chart=new Chart(document.getElementById('chart'),{
    type:'bar',
    data:{
      labels:['Steps','Time'],
      datasets:[{
        label:alg,
        data:[s,t]
      }]
    },
    options:{
      scales:{y:{beginAtZero:true}}
    }
  });
}

// ANIMATION
async function animate(path){
  for(let s of path){
    state=s;
    render();
    await new Promise(r=>setTimeout(r,120));
  }
}

init();