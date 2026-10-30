import {CONFIG} from './config'
export const money=n=>new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS',maximumFractionDigits:0}).format(n)
export const subtotal=cart=>cart.reduce((s,i)=>s+i.unit*i.qty,0)
export const lineDetail=i=>[...i.removed.map(r=>'Sin '+r.toLowerCase()),...i.extras.map(e=>`${e.name}: +${money(e.price)}`),...(i.note?['Nota: '+i.note]:[])]
export function newId(){
  const d=new Date(),p=n=>String(n).padStart(2,'0')
  const r=[...crypto.getRandomValues(new Uint8Array(2))].map(b=>b.toString(16).padStart(2,'0')).join('').toUpperCase()
  return `KEVO-${d.getFullYear()}${p(d.getMonth()+1)}${p(d.getDate())}-${r}`
}
export function validate(f){
  const e={}
  if(f.name.trim().length<3||!f.name.trim().includes(' '))e.name='Ingresá nombre y apellido.'
  if(CONFIG.requirePhone&&f.phone.replace(/\D/g,'').length<8)e.phone='Ingresá un teléfono válido.'
  if(f.mode==='Delivery'&&f.addr.trim().length<5)e.addr='La dirección es obligatoria para delivery.'
  return e
}
const SEP='━━━━━━━━━━━━━━━━━━'
export function buildMessage(f,cart,orderId){
  const delivery=f.mode==='Delivery',sub=subtotal(cart),fixed=typeof CONFIG.deliveryFee==='number'
  const L=[`🍔 *NUEVO PEDIDO — ${CONFIG.brand}*`,'',`📋 *Pedido:* ${orderId}`,'',`👤 *Cliente:* ${f.name}`]
  if(f.phone)L.push('',`📞 *Teléfono:* ${f.phone}`)
  L.push('',`🚚 *Modalidad:* ${delivery?'Delivery':'Retiro en el local'}`)
  if(delivery){L.push('',`📍 *Dirección:* ${f.addr}${f.barrio?', '+f.barrio:''}`);if(f.ref)L.push('',`📝 *Referencias:* ${f.ref}`)}
  L.push('',SEP,'','*PRODUCTOS*','')
  cart.forEach(i=>{L.push(`${i.qty}x ${i.name.toUpperCase()}`);lineDetail(i).forEach(l=>L.push('   - '+l));L.push('   - Importe: '+money(i.unit*i.qty),'')})
  let total=sub
  L.push(SEP,'',`*Subtotal:* ${money(sub)}`)
  if(delivery){if(fixed){total+=CONFIG.deliveryFee;L.push('',`*Envío:* ${money(CONFIG.deliveryFee)}`)}else L.push('','*Envío:* a coordinar')}
  L.push('',`*TOTAL DEL PEDIDO: ${money(total)}${delivery&&!fixed?' + envío':''}*`,'','💬 *Observaciones:*',f.obs||'Sin observaciones.')
  return L.join('\n')
}
export function waUrl(msg){
  const n=String(CONFIG.whatsapp||'').replace(/\D/g,'')
  if(!/^549\d{9,10}$/.test(n))return{error:`El número de WhatsApp del local está incompleto o no está configurado (${n||'vacío'}). Corregilo en CONFIG.whatsapp.`}
  return{url:`https://wa.me/${n}?text=${encodeURIComponent(msg)}`}
}