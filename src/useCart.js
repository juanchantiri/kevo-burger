import {useEffect,useState} from 'react'
import {newId} from './utils'
const read=(k,d)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch{return d}}
const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}}
export function useCart(){
  const [cart,setCart]=useState(()=>read('kevo_cart',[]))
  const [orderId,setOrderId]=useState(()=>read('kevo_order',null))
  useEffect(()=>write('kevo_cart',cart),[cart])
  useEffect(()=>write('kevo_order',orderId),[orderId])
  const add=(p,o={})=>{
    const {qty=1,removed=[],extras=[],note=''}=o
    const key=[p.id,removed.join('|'),extras.map(e=>e.id).join('|'),note].join('~')
    const unit=p.price+extras.reduce((s,e)=>s+e.price,0)
    setCart(c=>c.some(i=>i.key===key)?c.map(i=>i.key===key?{...i,qty:i.qty+qty}:i):[...c,{key,name:p.name,unit,qty,removed,extras,note}])
  }
  const change=(key,d)=>setCart(c=>c.map(i=>i.key===key?{...i,qty:i.qty+d}:i).filter(i=>i.qty>0))
  const remove=key=>setCart(c=>c.filter(i=>i.key!==key))
  const reset=()=>{setCart([]);setOrderId(null)}
  const ensureOrderId=()=>{if(!orderId)setOrderId(newId())}
  return{cart,orderId,add,change,remove,reset,ensureOrderId}
}