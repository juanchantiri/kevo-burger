import {CONFIG} from '../config'
import {money} from '../utils'
const TBD=<span className="ph-t">[A confirmar por el local]</span>

export function Promos({onAdd}){
  return(
    <section id="promos"><div className="wrap">
      <div className="sh"><h2>Combos</h2><p>Promociones del local. Los datos de abajo son de ejemplo.</p></div>
      {CONFIG.promos.length===0?<div className="empty dark">Pronto: nuevas promociones.</div>:CONFIG.promos.map(p=>(
        <div className="promo" key={p.id}><h3>{p.name}</h3><p>{p.items}</p><p>{p.valid||'Vigencia: a confirmar'} · Ejemplo editable</p>
          <div className="row"><span className="price">{money(p.price)}</span><button className="btn" onClick={()=>onAdd({id:p.id,name:p.name,price:p.price})}>Agregar combo</button></div></div>))}
    </div></section>
  )
}
export function Story(){
  return(
    <section id="historia"><div className="wrap story">
      <div><h2>Hecha para repetir</h2><p className="muted">Texto provisional: acá va la historia real de KEVO BURGER cuando el dueño la comparta. <span className="ph-t">[Pendiente de contenido]</span></p></div>
      <div className="ph2">Foto del local o del equipo<br/>[pendiente]</div>
    </div></section>
  )
}
export function Reviews(){
  return(
    <section className="revs" id="resenas"><div className="wrap">
      <div className="sh"><h2>Opiniones</h2></div>
      <div className="empty">Todavía no hay reseñas cargadas. Se publicarán opiniones reales de clientes, con su autorización, y el enlace al perfil de Google cuando esté confirmado.</div>
    </div></section>
  )
}
export function Location({onOrder}){
  const rows=[['Dirección',<>{CONFIG.address?CONFIG.address+', ':''}{CONFIG.city}</>],['Horarios',CONFIG.hours||TBD],['Delivery',CONFIG.deliveryZones||TBD],['Instagram',CONFIG.instagram||TBD],['Mapa',CONFIG.mapsUrl?<a href={CONFIG.mapsUrl}>Ver en Google Maps</a>:TBD]]
  return(
    <section id="ubicacion"><div className="wrap">
      <div className="sh"><h2>Dónde estamos</h2></div>
      <div className="loc"><dl>{rows.map(([a,b])=><div key={a}><dt>{a}</dt><dd>{b}</dd></div>)}</dl><div><button className="btn" onClick={onOrder}>Hacer mi pedido</button></div></div>
    </div></section>
  )
}
