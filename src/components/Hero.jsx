import {useEffect,useRef} from 'react'
import {CONFIG} from '../config'
import './hero.css'
import topBun from '../assets/burger/layer-top-bun.webp'
import toppings from '../assets/burger/layer-toppings.webp'
import patty from '../assets/burger/layer-patty.webp'
import bottomBun from '../assets/burger/layer-bottom-bun.webp'

// Escenario de 740 × 841 unidades. Por capa: posición armada (x0,y0) y ancho w; dy = cuánto se separa;
// rot = giro; delay = escalonado; ay = altura (en unidades) a la que apunta la flecha; side = lado de la nota; at = momento en que aparece la nota (0–1)
const SW=740,SH=841,SHIFT=137
const PAR=[30,22,14,8] // profundidad del parallax por capa (unidades)
const LAYERS=[
  {src:topBun,   x0:20,y0:0,  w:699,dy:-440,rot:-9,delay:0.00,z:3,ay:150,side:'r',at:0.40},
  {src:toppings, x0:21,y0:175,w:698,dy:-260,rot: 6,delay:0.10,z:4,ay:330,side:'l',at:0.47},
  {src:patty,    x0:17,y0:345,w:705,dy: -80,rot:-5,delay:0.16,z:2,ay:490,side:'r',at:0.54},
  {src:bottomBun,x0:19,y0:405,w:701,dy: 165,rot: 8,delay:0.06,z:1,ay:610,side:'l',at:0.61},
]
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v))
const ease=t=>t*t*(3-2*t)
const easeOut=t=>1-Math.pow(1-t,3)

// Flecha dibujada a mano; el trazo se "dibuja" con --n (0→1)
const Arrow=()=>(
  <svg viewBox="0 0 60 44" aria-hidden="true">
    <path className="a-line" pathLength="100" d="M5 5C26 1 46 11 53 34"/>
    <path className="a-head" pathLength="100" d="M43 29L53 36L57 23"/>
  </svg>
)

export default function Hero(){
  const root=useRef(null),stick=useRef(null),art=useRef(null),stage=useRef(null),ring=useRef(null),copy=useRef(null),end=useRef(null),hint=useRef(null)
  const marq=useRef(null),els=useRef([]),notes=useRef([]),noteIn=useRef([])

  // Pausa la cinta cuando no se ve en pantalla: cero consumo fuera del hero
  useEffect(()=>{
    const el=marq.current,io=new IntersectionObserver(([e])=>el.classList.toggle('off',!e.isIntersecting))
    io.observe(el);return()=>io.disconnect()
  },[])

  useEffect(()=>{
    const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches
    let cur=0,target=0,raf=0,last=0,k=0,px=0,py=0,tx=0,tyy=0
    const measure=()=>{k=stage.current.offsetHeight/SH}
    const render=()=>{
      if(!k)measure()
      LAYERS.forEach((L,i)=>{
        const p=easeOut(clamp((cur-L.delay*0.6)/(1-L.delay*0.6)))
        const ty=(L.dy*k*p+py*PAR[i]*0.6*k).toFixed(1),tx2=(px*PAR[i]*k).toFixed(1) // parallax con el cursor
        els.current[i].style.transform=`translate3d(${tx2}px,${ty}px,0) rotate(${reduce?0:(L.rot*p).toFixed(2)}deg)`
        notes.current[i].style.transform=`translate3d(${tx2}px,${ty}px,0)` // la nota acompaña a su capa
        noteIn.current[i].style.setProperty('--n',clamp((cur-L.at)/0.2).toFixed(3))
      })
      const e=ease(cur)
      stage.current.style.transform=`translate3d(0,${(SHIFT*k*e).toFixed(1)}px,0) scale(${reduce?1:1+0.04*e}) rotate(${reduce?0:(-4*e).toFixed(2)}deg)`
      if(!reduce)ring.current.style.transform=`rotate(${(e*140).toFixed(1)}deg)`
      art.current.style.setProperty('--px',px.toFixed(3));art.current.style.setProperty('--py',py.toFixed(3))
      art.current.style.setProperty('--chip',String(clamp(1-cur*3.5)))
      copy.current.style.opacity=String(clamp(1-cur*2.2))
      copy.current.style.transform=`translate3d(${(-40*e).toFixed(1)}px,0,0)`
      const en=clamp((cur-0.86)/0.14)
      end.current.style.opacity=String(en);end.current.style.pointerEvents=en>0.9?'auto':'none'
      hint.current.style.opacity=String(clamp(1-cur*8))
    }
    const tick=t=>{
      const dt=Math.min(0.05,(t-last)/1000||0.016);last=t
      cur=reduce?target:cur+(target-cur)*(1-Math.exp(-dt*9))
      px+=(tx-px)*(1-Math.exp(-dt*6));py+=(tyy-py)*(1-Math.exp(-dt*6))
      render()
      raf=(Math.abs(target-cur)>0.0005||Math.abs(tx-px)>0.001||Math.abs(tyy-py)>0.001)?requestAnimationFrame(tick):0
    }
    const kick=()=>{if(!raf){last=performance.now();raf=requestAnimationFrame(tick)}}
    const onMove=e=>{
      if(reduce||e.pointerType==='touch')return
      const r=stick.current.getBoundingClientRect()
      tx=(e.clientX-r.left)/r.width-0.5;tyy=(e.clientY-r.top)/r.height-0.5;kick()
    }
    const onLeave=()=>{tx=0;tyy=0;kick()}
    const onScroll=()=>{
      const r=root.current.getBoundingClientRect()
      target=clamp(-r.top/(r.height-stick.current.offsetHeight))
      kick()
    }
    const onResize=()=>{measure();onScroll();render()}
    measure();onScroll();render()
    addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onResize)
    const ro=new ResizeObserver(onResize);ro.observe(stage.current) // re-mide si cambia el tamaño (fuentes, barra del navegador, giro)
    const st=stick.current;st.addEventListener('pointermove',onMove);st.addEventListener('pointerleave',onLeave)
    return()=>{ro.disconnect();st.removeEventListener('pointermove',onMove);st.removeEventListener('pointerleave',onLeave);removeEventListener('scroll',onScroll);removeEventListener('resize',onResize);cancelAnimationFrame(raf)}
  },[])

  return(
    <div className="hx" ref={root}>
      <div className="hx-stick" ref={stick}>
        <div className="wrap hx-grid">
          <div className="hx-text">
            <div className="hx-copy" ref={copy}>
              <h1 aria-label="No es una hamburguesa más.">
                <span><i>No es</i></span><span><i>una burger</i></span><span><i>más.</i></span>
              </h1>
              <p>Armala a tu manera, mandá el pedido por WhatsApp y listo.</p>
              <div className="cta"><a className="btn" href="#menu">Ver la carta</a><a className="btn ghost" href="#promos">Ver combos</a></div>
            </div>
            <div className="hx-end" ref={end}>
              <h2>{CONFIG.heroEnd.title}</h2>
              <p>{CONFIG.heroEnd.text}</p>
              <a className="btn" href="#menu">Ver la carta</a>
            </div>
          </div>
          <div className="hx-slot"><div className="hx-art" ref={art} role="img" aria-label={CONFIG.heroNotes.join(', ')}>
            <div className="hx-ring" ref={ring}/>
            <div className="hx-ring2"/>
            <div className="hx-orbit"/>
            <svg className="hx-badge" viewBox="0 0 120 120" aria-hidden="true">
              <defs><path id="hxc" d="M60 60m-45 0a45 45 0 1 1 90 0a45 45 0 1 1-90 0"/></defs>
              <text><textPath href="#hxc" textLength="280" lengthAdjust="spacing">{CONFIG.heroBadge}</textPath></text>
              <circle cx="60" cy="60" r="9" fill="#FF6B2C"/>
            </svg>
            {CONFIG.heroChips.map((c,i)=>(
              <div key={c} className={'hx-chip c'+i} aria-hidden="true" style={{'--par':[26,-20,18][i]}}><span style={{animationDelay:`${-i*1.7}s`}}>{c}</span></div>
            ))}
            <div className="hx-float"><div className="hx-stage" ref={stage}>
              {LAYERS.map((L,i)=>(
                <img key={i} ref={n=>(els.current[i]=n)} className="hx-layer" src={L.src} alt="" draggable="false" decoding="async"
                  style={{left:`${(L.x0/SW*100).toFixed(3)}%`,width:`${(L.w/SW*100).toFixed(3)}%`,top:`${(L.y0/SH*100).toFixed(3)}%`,zIndex:L.z,'--i':i}}/>
              ))}
              {LAYERS.map((L,i)=>(
                <div key={i} ref={n=>(notes.current[i]=n)} className={'hx-note '+L.side} style={{top:`${(L.ay/SH*100).toFixed(3)}%`}} aria-hidden="true">
                  <div className="hx-note-in" ref={n=>(noteIn.current[i]=n)}><b>{CONFIG.heroNotes[i]}</b><Arrow/></div>
                </div>
              ))}
            </div></div>
          </div></div>
        </div>
        <div className="hx-marquee" ref={marq} aria-hidden="true"><div>{[0,1,2,3,4,5].map(n=><span key={n}>{CONFIG.heroMarquee.map(t=><b key={t+n}>{t}<i>✦</i></b>)}</span>)}</div></div>
        <p className="hx-hint" ref={hint}>Scrolleá y mirá qué lleva</p>
      </div>
    </div>
  )
}