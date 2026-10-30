import {useCallback,useRef,useState} from 'react'
import Hero from './components/Hero'
import Menu from './components/Menu'
import CartDrawer from './components/CartDrawer'
import {Location,Promos,Reviews,Story} from './components/Sections'
import {useCart} from './useCart'
import {money,subtotal} from './utils'

export default function App(){
  const cartApi=useCart(),{cart,add}=cartApi
  const [open,setOpen]=useState(false),[toast,setToast]=useState(''),[bump,setBump]=useState(0),t=useRef()
  const close=useCallback(()=>setOpen(false),[])
  const n=cart.reduce((s,i)=>s+i.qty,0)
  const onAdd=(p,o)=>{add(p,o);setBump(b=>b+1);setToast('Agregado: '+p.name);clearTimeout(t.current);t.current=setTimeout(()=>setToast(''),1600)}
  return(<>
    <div className="demo">Versión de propuesta: productos, precios y datos del local son de ejemplo y se editan en src/config.js.</div>
    <header><div className="wrap">
      <a className="logo" href="#top" aria-label="KEVO BURGER, inicio">KEVO<b>.</b>BURGER</a>
      <nav aria-label="Principal"><a className="nl" href="#menu">Menú</a><a className="nl" href="#promos">Promociones</a><a className="nl" href="#ubicacion">Ubicación</a>
        <button className="cartbtn" onClick={()=>setOpen(true)} aria-label="Abrir pedido">Pedido<span className="n" key={bump}>{n}</span></button></nav>
    </div></header>
    <main id="top"><Hero/><Menu onAdd={onAdd}/><Promos onAdd={onAdd}/><Story/><Reviews/><Location onOrder={()=>setOpen(true)}/></main>
    <footer><div className="wrap">© {new Date().getFullYear()} KEVO BURGER. Los pedidos quedan confirmados recién cuando el local los acepta por WhatsApp.</div></footer>
    {n>0&&<button className="bar" onClick={()=>setOpen(true)}><span>Ver pedido ({n})</span><span>{money(subtotal(cart))}</span></button>}
    <CartDrawer open={open} onClose={close} cartApi={cartApi}/>
    <div className={'toast'+(toast?' on':'')} role="status">{toast}</div>
  </>)
}
