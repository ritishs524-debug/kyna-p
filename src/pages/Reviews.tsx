import { motion } from 'framer-motion'
import { TestimonialsColumn } from '../components/ui/testimonials-columns'

type Review = {
  name: string
  rating: number
  text: string
}

const reviews: Review[] = [
  {
    name: 'Aman Sharma',
    rating: 5,
    text: 'Chronic back pain ke liye yahan physiotherapy aur manual therapy ka proper plan bana, 3 hafte mein hi uthna baithna kaafi aasaan ho gaya.',
  },
  {
    name: 'Priya Verma',
    rating: 5,
    text: 'Doctor ne simple language mein samjhaya ki mere knee ke liye kaunsa physiotherapy aur exercise therapy plan hoga; ab bina soch samajh ke stairs chadh leti hoon.',
  },
  {
    name: 'Rohit Gupta',
    rating: 4.5,
    text: 'Cricket injury ke baad unke sports physiotherapy aur exercise therapy program se knee strong ho gaya, ab match khelte waqt fear nahi rehta.',
  },
  {
    name: 'Simran Kaur',
    rating: 5,
    text: 'Osteopathy sessions shuru mein ajeeb lag rahe the par touch bohot gentle tha, cranial aur visceral work se pura body zyada balanced feel hota hai.',
  },
  {
    name: 'Vikas Yadav',
    rating: 4.5,
    text: 'Detailed assessment ke baad unhone clearly bataya ki mere case mein physiotherapy plus manual physical therapy best rahegi, WhatsApp follow up bhi regular raha.',
  },
  {
    name: 'Neha Singh',
    rating: 5,
    text: 'Post delivery back pain ke liye womens health physiotherapy li, lady physio ne pelvic floor aur core exercises bahut respectfully aur safely sikhayi.',
  },
  {
    name: 'Karan Mehta',
    rating: 4.5,
    text: 'Clinic modern hai, physiotherapy sessions mein machines sirf dikhane ke liye nahi, logically use hote hain; environment wellness lounge jaisa lagta hai.',
  },
  {
    name: 'Anjali Nair',
    rating: 5,
    text: 'Manual physical therapy se pehle thoda dar tha, lekin therapist har technique ko samjha ke karte the, gentle mobilisations se pain aur tightness dono kam hue.',
  },
  {
    name: 'Sandeep Singh',
    rating: 4.5,
    text: 'Frozen shoulder ke liye manual therapy, stretching aur home exercise therapy ka mix mila, dheere dheere almost full movement wapas aa gaya.',
  },
  {
    name: 'Megha Jain',
    rating: 5,
    text: 'Online booking se leke physiotherapy session tak sab smooth raha, time par bula lete hain isliye wait karne mein irritate nahi hota.',
  },
  {
    name: 'Harpreet Gill',
    rating: 4.5,
    text: 'Home physiotherapy ke liye jo exercise therapy videos bheje, unko phone pe dekh ke easily follow kar liya, galat karne ka chance hi nahi raha.',
  },
  {
    name: 'Akash Patel',
    rating: 4.5,
    text: 'Long sitting se neck pain aur headache rehta tha, unhone physiotherapy plus ergonomic counselling diya, ab desk setup aur posture dono sahi feel hote hain.',
  },
  {
    name: 'Ritu Aggarwal',
    rating: 5,
    text: 'Regular physiotherapy sessions mein har baar warm welcome milta hai, aisa lagta hai jaise apna family physio ho jo poori recovery journey handle kar raha hai.',
  },
  {
    name: 'Deepak Kumar',
    rating: 4.5,
    text: 'Sports physiotherapy wale ne pura movement analysis karke sports rehabilitation program banaya, jisse pain control ke saath performance bhi improve hui.',
  },
  {
    name: 'Shweta Joshi',
    rating: 5,
    text: 'Migraine aur neck tightness ke liye manual therapy, gentle osteopathy aur lifestyle education ka combo mila; ab attacks ki frequency kaafi kam ho gayi.',
  },
  {
    name: 'Gurpreet Singh',
    rating: 4.5,
    text: 'Samana branch chhota hai par physiotherapy aur exercise therapy dono evidence-based hain, genuine log hain, extra sessions push nahi karte.',
  },
  {
    name: 'Manisha Rani',
    rating: 5,
    text: 'Pelvic floor rehabilitation ke liye womens health physiotherapist se treatment liya, poora program bohot respect aur privacy ke saath design kiya gaya.',
  },
  {
    name: 'Aditya Rao',
    rating: 4.5,
    text: 'ACL surgery ke baad unka structured post-surgery physiotherapy aur exercise therapy protocol follow kiya, ab bina fear ke jogging aur light sports kar sakta hoon.',
  },
  {
    name: 'Sonal Gupta',
    rating: 5,
    text: 'Clinic ka calming ambience aur physiotherapy plus osteopathy services ka mix ne chronic pain ke saath-saath anxiety bhi kaafi kam kar di.',
  },
  {
    name: 'Rahul Bansal',
    rating: 4.5,
    text: 'Work from home back pain ke liye ergonomic assessment kiya, sath hi home exercise therapy plan diya; ab laptop work itna strain nahi deta.',
  },
  {
    name: 'Pooja Mishra',
    rating: 5,
    text: 'Meri maa ke liye physiotherapy at home li, therapist ne falls prevention exercises unki speed pe karwayi, elderly ke saath bohot patience dikhaya.',
  },
  {
    name: 'Imran Khan',
    rating: 4.5,
    text: 'Bar-bar ankle sprain ke baad yahan sports physiotherapy aur balance training hui, ab running track pe stability bohot better lagti hai.',
  },
  {
    name: 'Sneha Kulkarni',
    rating: 5,
    text: 'Har physiotherapy session mein woh clearly explain karte hain ki ye exercise therapy kyun karwa rahe hain, isse mujhe apne recovery pe full control jaisa feel hota hai.',
  },
  {
    name: 'Tarun Malhotra',
    rating: 4.5,
    text: 'Booking se lekar follow up tak sab digital hai, home exercise therapy ka PDF aur videos mail pe mil gaye, travel na karne walon ke liye perfect hai.',
  },
  {
    name: 'Jaspreet Kaur',
    rating: 5,
    text: 'Pregnancy ke dauran hip pain ke liye antenatal physiotherapy li, doctor-approved safe exercises aur pelvic support techniques se bohot relief mila.',
  },
  {
    name: 'Nikhil Jain',
    rating: 4.5,
    text: 'Chiropractic adjustment yahan bina hurry ke, proper assessment ke baad kiya gaya, sath hi physiotherapy exercises bhi di gayi taaki result long term rahe.',
  },
  {
    name: 'Rashmi Desai',
    rating: 5,
    text: 'Post-surgery aur elderly physiotherapy ke liye hygiene bohot important hota hai, yahan sanitisation aur safety itni strong hai ki parents ko lane mein bilkul darr nahi laga.',
  },
  {
    name: 'Arjun Saini',
    rating: 4.5,
    text: 'Gym overtraining ke baad sports rehab aur exercise therapy se samjha ki recovery bhi training ka part hai; ab workout plan bhi unke according banata hoon.',
  },
  {
    name: 'Kavita Sharma',
    rating: 5,
    text: 'Har session mein thoda manual therapy, thoda exercise therapy aur functional training mix hoti thi, isliye boring nahi laga aur body har hafte better feel hui.',
  },
  {
    name: 'Sahil Arora',
    rating: 4.5,
    text: 'Corporate job ke busy schedule ke hisaab se unhone exercise therapy plan customise kiya, kaam ke baad bhi manageable tha isliye sessions skip nahi hue.',
  },
  {
    name: 'Bhavna Kapoor',
    rating: 5,
    text: 'Shoulder stiffness ke liye manual physical therapy aur ghar ke liye simple band exercises di, ab hair wash ya dupatta uthane mein bilkul problem nahi rehti.',
  },
  {
    name: 'Yogesh Chauhan',
    rating: 4.5,
    text: 'Bike accident ke baad neuro-aur ortho physiotherapy ka mix mila, graded exposure se movement ka dar dheere dheere khatam ho gaya.',
  },
  {
    name: 'Nisha Reddy',
    rating: 5,
    text: 'Online physiotherapy consultation mein video call pe posture check hua, phir jo exercise therapy stretches sikhaye unse ghar baithe hi kaafi relief mil gaya.',
  },
  {
    name: 'Rohan Saxena',
    rating: 4.5,
    text: 'Yahan sirf machines nahi chalti, therapist poora time saath rehte hain aur evidence-based physiotherapy protocol follow karte hain, isliye personalised feel aata hai.',
  },
  {
    name: 'Alka Devi',
    rating: 5,
    text: 'Knee replacement ke baad unka post-operative physiotherapy aur falls prevention program follow kiya, ab bina support ke araam se ghar ke stairs chadh leti hoon.',
  },
  {
    name: 'Mohit Batra',
    rating: 4.5,
    text: 'Late evening physiotherapy slots mil gaye isliye office ke baad bhi aapointement manage ho gayi, busy IT logon ke liye ye flexibility bohot helpful hai.',
  },
  {
    name: 'Pallavi Sinha',
    rating: 5,
    text: 'Har session ke baad woh progress aur next goal clearly likh ke dete hain, lagta hai proper structured physiotherapy program chal raha hai, random sessions nahi.',
  },
  {
    name: 'Gaganpreet Singh',
    rating: 4.5,
    text: 'Mujhe laga sirf exercises karwayenge, lekin unhone breathing, sleep aur hydration bhi include kiya; ekdum holistic physiotherapy approach jaisa services page pe likha hai.',
  },
  {
    name: 'Divya Menon',
    rating: 5,
    text: 'Chronic pain wale tough days par bhi therapist ne long-term rehab plan yaad dila ke gently push kiya, aise consistent support se hi real recovery hoti hai.',
  },
  {
    name: 'Sameer Ali',
    rating: 4.5,
    text: 'Physiotherapy packages aur home visit charges pehle hi clearly explain kar diye, beech mein koi hidden cost nahi aaya, pricing bilkul transparent rahi.',
  },
  {
    name: 'Kirti Chawla',
    rating: 5,
    text: 'Clinic ka interior aisa hai jaise rehab plus wellness studio, manual therapy aur osteopathy sessions ke dauran bhi spa jaisa calm feel aata hai.',
  },
  {
    name: 'Ashish Thakur',
    rating: 4.5,
    text: 'Purani shoulder injury baarish mein dard karti thi, manual physical therapy aur targeted exercise therapy ke baad teen mahine se koi flare-up nahi hua.',
  },
  {
    name: 'Ria Kapoor',
    rating: 5,
    text: 'Chronic back aur neck issues ke bawajood therapist patiently sunte hain, physiotherapy ke sath-sath lifestyle aur work habits pe bhi time se guidance dete hain.',
  },
  {
    name: 'Sagar Joshi',
    rating: 4.5,
    text: 'Exercise therapy aur posture correction tips se everyday tasks jaise laptop work, driving aur cooking bohot aasaan lagne lage, body pe load kam feel hota hai.',
  },
  {
    name: 'Mona Arora',
    rating: 5,
    text: 'Main reviews dekh ke aayi thi aur yahan physiotherapy, osteopathy aur chiropractic jaise services ek hi roof ke neeche mil gaye, experience expectations se better nikla.',
  },
  {
    name: 'Lokesh Verma',
    rating: 4.5,
    text: 'Reception se lekar physio tak sab polite hain, calmly explain karte hain ki mere liye clinic sessions better rahenge ya physiotherapy at home, decision lena easy ho gaya.',
  },
  {
    name: 'Tanvi Arjun',
    rating: 5,
    text: 'PCOS ke saath weight gain aur joint pain ke liye womens health physiotherapy aur gradual exercise therapy plan mila, hormones ko shock kiye bina results dikhne lage.',
  },
  {
    name: 'Jatin Kohli',
    rating: 4.5,
    text: 'Har session pe pain score aur movement check karke physiotherapy ki intensity adjust karte hain, is evidence-based approach se trust naturally build ho jata hai.',
  },
  {
    name: 'Seema Nanda',
    rating: 5,
    text: 'Falls prevention aur strength training program ke baad ghar walon ne bhi notice kiya ki ab main zyada active ho gayi hoon, staircase aur market easily handle ho jata hai.',
  },
  {
    name: 'Varun Chawla',
    rating: 4.5,
    text: 'Guidance bilkul simple aur honest thi, structured physiotherapy plus home exercises se jo result pehle hi samjhaya tha wahi mila, koi overpromising nahi.',
  },
]

// Split reviews into 4 columns for the scrolling layout
const col1 = reviews.slice(0, 13)
const col2 = reviews.slice(13, 25)
const col3 = reviews.slice(25, 38)
const col4 = reviews.slice(38, 50)

const EASE = [0.22, 1, 0.36, 1] as const

export function Reviews() {
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-12 text-center"
        >
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-sky-600 dark:text-sky-400">
            Patient Reviews
          </p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl dark:text-slate-50">
            What people across India say about KYNA
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            Real feedback from patients who trusted us with their recovery — kuch simple English
            mein, kuch pure Hinglish mein — taaki aapko asli experience ka feel aaye.
          </p>
        </motion.header>

        {/* Scrolling testimonial columns */}
        <div className="flex justify-center gap-5 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] max-h-[750px] overflow-hidden">
          <TestimonialsColumn testimonials={col1} duration={25} />
          <TestimonialsColumn testimonials={col2} duration={30} className="hidden sm:block" />
          <TestimonialsColumn testimonials={col3} duration={22} className="hidden md:block" />
          <TestimonialsColumn testimonials={col4} duration={28} className="hidden lg:block" />
        </div>
      </div>
    </div>
  )
}
