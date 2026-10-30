// Todo lo editable del negocio vive acá. Los productos son EJEMPLOS.
import laClasica from './assets/burgers/LaClasica.png'
import laKevo from './assets/burgers/LaKevo.png'
import laBestia from './assets/burgers/LaBestia.png'
import laBruta from './assets/burgers/LaBruta.png'
export const CONFIG={
  brand:'KEVO BURGER',
  whatsapp:'549249389', // INCOMPLETO: formato 549 + código de área + abonado (12–13 dígitos)
  requirePhone:true,
  deliveryFee:null, // número en pesos, o null = "a coordinar"
  address:null, city:'Tandil (a confirmar)', hours:null, instagram:null, mapsUrl:null, deliveryZones:null,
  // ---- HERO (editable). Los textos de las notas van de arriba hacia abajo según las capas de la hamburguesa ----
  heroNotes:['El pan','Cebolla, panceta y BBQ','Carne con cheddar fundido','Base tostada'],
  heroEnd:{title:'Sabor en cada capa.',text:'Elegí la tuya y armala a tu manera.'},
  heroChips:['Delivery o retiro','Pedido por WhatsApp','Armala a tu manera'],
  heroBadge:'KEVO BURGER • ARMALA A TU MANERA • ',
  heroMarquee:['KEVO BURGER','Pedí por WhatsApp','Delivery o retiro','Armala a tu manera'],
  categories:[{id:'clasicas',name:'Clásicas'},{id:'smash',name:'Smash'},{id:'acomp',name:'Papas y acompañamientos'},{id:'bebidas',name:'Bebidas'}],
  extras:[{id:'ched',name:'Extra cheddar',price:800},{id:'bacon',name:'Panceta',price:1200},{id:'huevo',name:'Huevo',price:600}],
  products:[
  {
    id: 'p1',
    cat: 'clasicas',
    name: 'La Clásica',
    desc: 'Carne, queso, lechuga y tomate en pan de papa.',
    price: 9500,
    image: laClasica,
    ing: ['Cebolla', 'Lechuga', 'Tomate', 'Pickles'],
    extras: true,
    available: true
  },
  {
    id: 'p2',
    cat: 'smash',
    name: 'La Kevo',
    desc: 'Doble medallón smash, cheddar, panceta y salsa Kevo.',
    price: 12500,
    image: laKevo,
    ing: ['Cebolla', 'Pickles', 'Salsa'],
    extras: true,
    available: true
  },
  {
    id: 'p3',
    cat: 'smash',
    name: 'La Bestia',
    desc: 'Doble medallón smash, cheddar, panceta y barbacoa.',
    price: 8500,
    image: laBestia,
    ing: ['Cebolla', 'Pickles', 'Salsa'],
    extras: true,
    available: true
  },
  {
    id: 'p4',
    cat: 'smash',
    name: 'La Bruta',
    desc: 'Dos smash, cebolla, cheddar y salsa Kevo.',
    price: 11500,
    image: laBruta,
    ing: ['Cebolla', 'Pickles', 'Salsa'],
    extras: true,
    available: true
  },
    {id:'p5',cat:'acomp',name:'Papas fritas',desc:'Porción para compartir.',price:4500,ing:[],extras:false,available:true},
    {id:'p6',cat:'acomp',name:'Papas con cheddar',desc:'Papas bañadas en cheddar.',price:6000,ing:[],extras:false,available:true},
    {id:'p7',cat:'bebidas',name:'Gaseosa 500 ml',desc:'Consultar sabores disponibles.',price:2500,ing:[],extras:false,available:true}
  ],
  promos:[{id:'c1',name:'Combo Kevo',items:'Kevo Clásica + Papas fritas + Gaseosa 500 ml',price:15500,valid:null}]
}