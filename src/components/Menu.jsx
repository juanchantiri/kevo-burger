import {useEffect,useRef,useState} from 'react'
import {CONFIG} from '../config'
import {money} from '../utils'

const reduceMotion=()=>matchMedia('(prefers-reduced-motion: reduce)').matches

const Icon=({drink})=>drink
  ?<svg viewBox="0 0 100 90" aria-hidden="true"><circle cx="50" cy="45" r="28" fill="#FFC857"/><circle cx="50" cy="45" r="18" fill="#1d1d1d"/></svg>
  :<svg viewBox="0 0 100 90" aria-hidden="true"><path d="M10 38c0-18 18-28 40-28s40 10 40 28z" fill="#FF6B2C"/><rect x="8" y="42" width="84" height="8" fill="#7BA23F"/><path d="M10 52h80l-10 9-10-6-10 9-10-8-10 8-10-8-10 8z" fill="#FFC857"/><rect x="8" y="56" width="84" height="12" rx="5" fill="#4a2616"/><path d="M10 72h80v4c0 8-14 12-40 12S10 84 10 76z" fill="#FF6B2C"/></svg>

// Modal que "se despliega" desde la tarjeta que se tocó
function Detail({product,origin,onClose,onAdd}){
  const ref=useRef(null)
  const [qty,setQty]=useState(1),[kept,setKept]=useState(()=>product.ing.map(()=>true)),[ex,setEx]=useState({}),[note,setNote]=useState('')
  const frames=()=>{
    const d=ref.current.getBoundingClientRect()
    const dx=origin.left+origin.width/2-(d.left+d.width/2),dy=origin.top+origin.height/2-(d.top+d.height/2)
    return[{transform:`translate(${dx}px,${dy}px) scale(${Math.min(.5,origin.width/d.width)})`,opacity:0},{transform:'none',opacity:1}]
  }
  useEffect(()=>{
    ref.current.showModal()
    if(origin&&!reduceMotion())ref.current.animate(frames(),{duration:460,easing:'cubic-bezier(.2,.85,.2,1)'})
  },[]) // eslint-disable-line
  const close=()=>{
    if(!origin||reduceMotion())return onClose()
    ref.current.animate(frames().reverse(),{duration:280,easing:'ease-in',fill:'forwards'}).finished.then(onClose,onClose)
  }
  const extras=CONFIG.extras.filter(e=>ex[e.id])
  const total=(product.price+extras.reduce((s,e)=>s+e.price,0))*qty
  const submit=()=>{onAdd(product,{qty,removed:product.ing.filter((_,i)=>!kept[i]),extras,note:note.trim()});close()}
  return(
    <dialog ref={ref} className="dl" aria-labelledby="mt"
      onCancel={e=>{e.preventDefault();close()}} onClick={e=>e.target===ref.current&&close()}>
      <button className="dl-x" onClick={close} aria-label="Cerrar">×</button>
      <div className="dl-scroll">
        {product.image
          ?<img className="dl-img" src={product.image} alt={product.name}/>
          :<div className="dl-img dl-ph"><Icon drink={product.cat==='bebidas'||product.cat==='acomp'}/></div>}
        <div className="mb">
          <div className="row dl-head"><h3 id="mt">{product.name}</h3><span className="price">{money(product.price)}</span></div>
          <p className="dl-desc">{product.desc}</p>
          {product.ing.length>0&&<div className="dl-ing" aria-label="Ingredientes">{product.ing.map(x=><span key={x}>{x}</span>)}</div>}
          {product.ing.length>0&&<fieldset><legend className="note">Sacale lo que no quieras</legend>
            {product.ing.map((x,i)=><label className="chk" key={x}><input type="checkbox" checked={kept[i]} onChange={()=>setKept(k=>k.map((v,j)=>j===i?!v:v))}/><span>{x}</span></label>)}</fieldset>}
          {product.extras&&<fieldset><legend className="note">Extras</legend>
            {CONFIG.extras.map(x=><label className="chk" key={x.id}><input type="checkbox" checked={!!ex[x.id]} onChange={()=>setEx(s=>({...s,[x.id]:!s[x.id]}))}/><span>{x.name}</span><span>+{money(x.price)}</span></label>)}</fieldset>}
          <label>Instrucciones especiales<textarea rows="2" maxLength="140" value={note} onChange={e=>setNote(e.target.value)}/></label>
        </div>
      </div>
      <div className="dl-foot">
        <div className="row"><div className="q"><button type="button" aria-label="Menos" onClick={()=>setQty(q=>Math.max(1,q-1))}>−</button><span>{qty}</span><button type="button" aria-label="Más" onClick={()=>setQty(q=>Math.min(20,q+1))}>+</button></div><strong className="price">{money(total)}</strong></div>
        <button className="btn" onClick={submit}>Agregar al pedido</button>
      </div>
    </dialog>
  )
}

export default function Menu({onAdd}){
  const [cat,setCat]=useState(CONFIG.categories[0].id),[detail,setDetail]=useState(null)
  const list=CONFIG.products.filter(p=>p.cat===cat)
  const open=(p,e)=>setDetail({p,origin:e.currentTarget.closest('article').getBoundingClientRect()})
  return(
    <section id="menu"><div className="wrap">
      <div className="sh"><h2>La carta</h2><p>Tocá una burger para ver el detalle, sacarle ingredientes o sumarle extras.</p></div>
      <div className="tabs" role="group" aria-label="Categorías">
        {CONFIG.categories.map(c=><button key={c.id} aria-pressed={c.id===cat} onClick={()=>setCat(c.id)}>{c.name}</button>)}
      </div>
      <div className="grid" key={cat} aria-live="polite">
        {list.length===0&&<div className="empty">Todavía no hay productos en esta categoría.</div>}
        {list.map((p,i)=>(
          <article className="card" key={p.id} style={{animationDelay:`${i*60}ms`}}>
            <div className="ph">
              {p.image?<img src={p.image} alt={p.name} className="product-image" loading="lazy"/>:<Icon drink={p.cat==='bebidas'||p.cat==='acomp'}/>}
            </div>
            <div className="b">
              <h3><button className="card-hit" onClick={e=>open(p,e)} aria-label={`Ver detalle de ${p.name}`}>{p.name}</button></h3>
              <p className="d">{p.desc}</p>
              <span className="go" aria-hidden="true">Ver detalle →</span>
              <div className="f"><span className="price">{money(p.price)}</span>
                {p.available?<button className="btn sm" onClick={()=>onAdd(p)}>Agregar</button>:<span className="note">No disponible</span>}
              </div>
            </div>
          </article>))}
      </div>
      {detail&&<Detail product={detail.p} origin={detail.origin} onClose={()=>setDetail(null)} onAdd={onAdd}/>}
    </div></section>
  )
}
