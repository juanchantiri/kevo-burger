import {useEffect,useState} from 'react'
import {CONFIG} from '../config'
import {buildMessage,lineDetail,money,subtotal,validate,waUrl} from '../utils'

const EMPTY={name:'',phone:'',mode:'Retiro en el local',addr:'',barrio:'',ref:'',obs:''}
const loadForm=()=>{try{return{...EMPTY,...JSON.parse(localStorage.getItem('kevo_form')||'{}')}}catch{return EMPTY}}

export default function CartDrawer({open,onClose,cartApi}){
  const {cart,orderId,change,remove,reset,ensureOrderId}=cartApi
  const [view,setView]=useState('cart'),[f,setF]=useState(loadForm),[err,setErr]=useState({}),[res,setRes]=useState(null)
  useEffect(()=>{if(open)setView('cart')},[open])
  useEffect(()=>{if(view==='form')ensureOrderId()},[view]) // eslint-disable-line
  useEffect(()=>{const k=e=>e.key==='Escape'&&onClose();addEventListener('keydown',k);return()=>removeEventListener('keydown',k)},[onClose])
  const set=k=>e=>setF(s=>({...s,[k]:e.target.value}))
  const sub=subtotal(cart),delivery=f.mode==='Delivery'
  const send=()=>{
    const er=validate(f);setErr(er)
    if(Object.keys(er).length||!cart.length||!orderId)return
    try{localStorage.setItem('kevo_form',JSON.stringify(f))}catch{}
    const w=waUrl(buildMessage(f,cart,orderId))
    if(w.error)return setRes({error:w.error})
    const win=window.open(w.url,'_blank','noopener')
    setRes({url:w.url,blocked:!win})
  }
  const finish=()=>{reset();setRes(null);setView('cart')}
  return(<>
    <div className={'ov'+(open?' on':'')} onClick={onClose}/>
    <aside className={'drawer'+(open?' on':'')} aria-label="Tu pedido" aria-hidden={!open}>
      <div className="dh"><h2>{view==='cart'?'Tu pedido':'Tus datos'}</h2><button className="x" onClick={onClose} aria-label="Cerrar">×</button></div>
      {view==='cart'?<>
        <div className="db">{cart.length===0?<div className="empty">Tu pedido está vacío. Elegí una burger de la carta para empezar.</div>:cart.map(i=>(
          <div className="li" key={i.key}>
            <div><strong>{i.name}</strong>{lineDetail(i).map(l=><small key={l}>{l}</small>)}</div><strong>{money(i.unit*i.qty)}</strong>
            <div className="q"><button onClick={()=>change(i.key,-1)} aria-label="Menos">−</button><span>{i.qty}</span><button onClick={()=>change(i.key,1)} aria-label="Más">+</button></div>
            <button className="link" onClick={()=>remove(i.key)}>Quitar</button>
          </div>))}</div>
        <div className="df">{cart.length===0?<a className="btn" href="#menu" onClick={onClose}>Ver la carta</a>:<>
          <div className="tot"><span>Subtotal</span><span>{money(sub)}</span></div>
          <div className="tot note"><span>Envío</span><span>{typeof CONFIG.deliveryFee==='number'?money(CONFIG.deliveryFee):'a coordinar si es delivery'}</span></div>
          <div className="tot big"><span>Total</span><span>{money(sub)}</span></div>
          <button className="btn" onClick={()=>setView('form')}>Continuar con el pedido</button></>}</div>
      </>:<>
        <div className="db">
          <p className="note">Pedido {orderId}</p>
          <label>Nombre y apellido<input type="text" autoComplete="name" className={err.name?'bad':''} value={f.name} onChange={set('name')}/><span className="err">{err.name}</span></label>
          <label>Teléfono de contacto<input type="tel" autoComplete="tel" className={err.phone?'bad':''} value={f.phone} onChange={set('phone')}/><span className="err">{err.phone}</span></label>
          <div className="seg" role="radiogroup" aria-label="Modalidad">
            {['Retiro en el local','Delivery'].map(m=><label key={m}><input type="radio" name="mode" checked={f.mode===m} onChange={()=>setF(s=>({...s,mode:m}))}/>{m==='Delivery'?'Delivery':'Retiro'}</label>)}
          </div>
          {delivery&&<>
            <label>Dirección completa<input type="text" autoComplete="street-address" className={err.addr?'bad':''} value={f.addr} onChange={set('addr')}/><span className="err">{err.addr}</span></label>
            <label>Barrio o localidad<input type="text" value={f.barrio} onChange={set('barrio')}/></label>
            <label>Referencias (opcional)<input type="text" value={f.ref} onChange={set('ref')}/></label></>}
          <label>Observaciones (opcional)<textarea rows="2" value={f.obs} onChange={set('obs')}/></label>
          {res?.error&&<div className="alert" role="alert">{res.error}</div>}
          {res?.url&&<div className="alert" role="status">Se preparó el mensaje en WhatsApp. Tocá <strong>Enviar</strong> allí para completar el pedido. El local lo confirma recién cuando lo acepte. {res.blocked&&<a href={res.url} target="_blank" rel="noopener">Abrir WhatsApp</a>}<br/><button className="link" onClick={finish}>Terminé: empezar un pedido nuevo</button></div>}
        </div>
        <div className="df"><div className="tot big"><span>Total</span><span>{money(sub)}</span></div>
          <button className="btn" onClick={send}>Enviar pedido por WhatsApp</button><button className="btn ghost sm" onClick={()=>setView('cart')}>Volver al pedido</button></div>
      </>}
    </aside>
  </>)
}
