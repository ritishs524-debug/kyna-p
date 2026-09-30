'use client'

import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHero } from '../components/ui/PageHero'
import { SectionHeading } from '../components/ui/SectionHeading'
import { CTASection } from '../components/ui/CTASection'
import { RevealGroup } from '../components/ui/Reveal'
import { TestimonialCard, type Testimonial } from '../components/ui/cards'
import { container, dark, sectionLight, sectionTint } from '../lib/design-tokens'

type Review = Testimonial

/**
 * The 50 reviews, unchanged. `category` is derived from the treatment each
 * review itself names; the one review that names no treatment carries none
 * rather than a guessed label.
 */
const reviews: Review[] = [
  { name: 'Aman Sharma', rating: 5.0, text: 'Chronic back pain ke liye yahan physiotherapy aur manual therapy ka proper plan bana, 3 hafte mein hi uthna baithna kaafi aasaan ho gaya.', category: 'Manual Physical Therapy' },
  { name: 'Priya Verma', rating: 5.0, text: 'Doctor ne simple language mein samjhaya ki mere knee ke liye kaunsa physiotherapy aur exercise therapy plan hoga; ab bina soch samajh ke stairs chadh leti hoon.', category: 'Exercise Therapy' },
  { name: 'Rohit Gupta', rating: 4.5, text: 'Cricket injury ke baad unke sports physiotherapy aur exercise therapy program se knee strong ho gaya, ab match khelte waqt fear nahi rehta.', category: 'Exercise Therapy' },
  { name: 'Simran Kaur', rating: 5.0, text: 'Osteopathy sessions shuru mein ajeeb lag rahe the par touch bohot gentle tha, cranial aur visceral work se pura body zyada balanced feel hota hai.', category: 'Osteopathy' },
  { name: 'Vikas Yadav', rating: 4.5, text: 'Detailed assessment ke baad unhone clearly bataya ki mere case mein physiotherapy plus manual physical therapy best rahegi, WhatsApp follow up bhi regular raha.', category: 'Manual Physical Therapy' },
  { name: 'Neha Singh', rating: 5.0, text: 'Post delivery back pain ke liye womens health physiotherapy li, lady physio ne pelvic floor aur core exercises bahut respectfully aur safely sikhayi.', category: 'Pelvic Floor & Women’s Health' },
  { name: 'Karan Mehta', rating: 4.5, text: 'Clinic modern hai, physiotherapy sessions mein machines sirf dikhane ke liye nahi, logically use hote hain; environment wellness lounge jaisa lagta hai.', category: 'Physiotherapy' },
  { name: 'Anjali Nair', rating: 5.0, text: 'Manual physical therapy se pehle thoda dar tha, lekin therapist har technique ko samjha ke karte the, gentle mobilisations se pain aur tightness dono kam hue.', category: 'Manual Physical Therapy' },
  { name: 'Sandeep Singh', rating: 4.5, text: 'Frozen shoulder ke liye manual therapy, stretching aur home exercise therapy ka mix mila, dheere dheere almost full movement wapas aa gaya.', category: 'Physiotherapy at Home' },
  { name: 'Megha Jain', rating: 5.0, text: 'Online booking se leke physiotherapy session tak sab smooth raha, time par bula lete hain isliye wait karne mein irritate nahi hota.', category: 'Physiotherapy' },
  { name: 'Harpreet Gill', rating: 4.5, text: 'Home physiotherapy ke liye jo exercise therapy videos bheje, unko phone pe dekh ke easily follow kar liya, galat karne ka chance hi nahi raha.', category: 'Physiotherapy at Home' },
  { name: 'Akash Patel', rating: 4.5, text: 'Long sitting se neck pain aur headache rehta tha, unhone physiotherapy plus ergonomic counselling diya, ab desk setup aur posture dono sahi feel hote hain.', category: 'Physiotherapy' },
  { name: 'Ritu Aggarwal', rating: 5.0, text: 'Regular physiotherapy sessions mein har baar warm welcome milta hai, aisa lagta hai jaise apna family physio ho jo poori recovery journey handle kar raha hai.', category: 'Physiotherapy' },
  { name: 'Deepak Kumar', rating: 4.5, text: 'Sports physiotherapy wale ne pura movement analysis karke sports rehabilitation program banaya, jisse pain control ke saath performance bhi improve hui.', category: 'Sports Physiotherapy' },
  { name: 'Shweta Joshi', rating: 5.0, text: 'Migraine aur neck tightness ke liye manual therapy, gentle osteopathy aur lifestyle education ka combo mila; ab attacks ki frequency kaafi kam ho gayi.', category: 'Osteopathy' },
  { name: 'Gurpreet Singh', rating: 4.5, text: 'Samana branch chhota hai par physiotherapy aur exercise therapy dono evidence-based hain, genuine log hain, extra sessions push nahi karte.', category: 'Exercise Therapy' },
  { name: 'Manisha Rani', rating: 5.0, text: 'Pelvic floor rehabilitation ke liye womens health physiotherapist se treatment liya, poora program bohot respect aur privacy ke saath design kiya gaya.', category: 'Pelvic Floor & Women’s Health' },
  { name: 'Aditya Rao', rating: 4.5, text: 'ACL surgery ke baad unka structured post-surgery physiotherapy aur exercise therapy protocol follow kiya, ab bina fear ke jogging aur light sports kar sakta hoon.', category: 'Exercise Therapy' },
  { name: 'Sonal Gupta', rating: 5.0, text: 'Clinic ka calming ambience aur physiotherapy plus osteopathy services ka mix ne chronic pain ke saath-saath anxiety bhi kaafi kam kar di.', category: 'Osteopathy' },
  { name: 'Rahul Bansal', rating: 4.5, text: 'Work from home back pain ke liye ergonomic assessment kiya, sath hi home exercise therapy plan diya; ab laptop work itna strain nahi deta.', category: 'Physiotherapy at Home' },
  { name: 'Pooja Mishra', rating: 5.0, text: 'Meri maa ke liye physiotherapy at home li, therapist ne falls prevention exercises unki speed pe karwayi, elderly ke saath bohot patience dikhaya.', category: 'Physiotherapy at Home' },
  { name: 'Imran Khan', rating: 4.5, text: 'Bar-bar ankle sprain ke baad yahan sports physiotherapy aur balance training hui, ab running track pe stability bohot better lagti hai.', category: 'Sports Physiotherapy' },
  { name: 'Sneha Kulkarni', rating: 5.0, text: 'Har physiotherapy session mein woh clearly explain karte hain ki ye exercise therapy kyun karwa rahe hain, isse mujhe apne recovery pe full control jaisa feel hota hai.', category: 'Exercise Therapy' },
  { name: 'Tarun Malhotra', rating: 4.5, text: 'Booking se lekar follow up tak sab digital hai, home exercise therapy ka PDF aur videos mail pe mil gaye, travel na karne walon ke liye perfect hai.', category: 'Physiotherapy at Home' },
  { name: 'Jaspreet Kaur', rating: 5.0, text: 'Pregnancy ke dauran hip pain ke liye antenatal physiotherapy li, doctor-approved safe exercises aur pelvic support techniques se bohot relief mila.', category: 'Antenatal Care' },
  { name: 'Nikhil Jain', rating: 4.5, text: 'Chiropractic adjustment yahan bina hurry ke, proper assessment ke baad kiya gaya, sath hi physiotherapy exercises bhi di gayi taaki result long term rahe.', category: 'Chiropractic' },
  { name: 'Rashmi Desai', rating: 5.0, text: 'Post-surgery aur elderly physiotherapy ke liye hygiene bohot important hota hai, yahan sanitisation aur safety itni strong hai ki parents ko lane mein bilkul darr nahi laga.', category: 'Physiotherapy' },
  { name: 'Arjun Saini', rating: 4.5, text: 'Gym overtraining ke baad sports rehab aur exercise therapy se samjha ki recovery bhi training ka part hai; ab workout plan bhi unke according banata hoon.', category: 'Exercise Therapy' },
  { name: 'Kavita Sharma', rating: 5.0, text: 'Har session mein thoda manual therapy, thoda exercise therapy aur functional training mix hoti thi, isliye boring nahi laga aur body har hafte better feel hui.', category: 'Exercise Therapy' },
  { name: 'Sahil Arora', rating: 4.5, text: 'Corporate job ke busy schedule ke hisaab se unhone exercise therapy plan customise kiya, kaam ke baad bhi manageable tha isliye sessions skip nahi hue.', category: 'Exercise Therapy' },
  { name: 'Bhavna Kapoor', rating: 5.0, text: 'Shoulder stiffness ke liye manual physical therapy aur ghar ke liye simple band exercises di, ab hair wash ya dupatta uthane mein bilkul problem nahi rehti.', category: 'Manual Physical Therapy' },
  { name: 'Yogesh Chauhan', rating: 4.5, text: 'Bike accident ke baad neuro-aur ortho physiotherapy ka mix mila, graded exposure se movement ka dar dheere dheere khatam ho gaya.', category: 'Physiotherapy' },
  { name: 'Nisha Reddy', rating: 5.0, text: 'Online physiotherapy consultation mein video call pe posture check hua, phir jo exercise therapy stretches sikhaye unse ghar baithe hi kaafi relief mil gaya.', category: 'Exercise Therapy' },
  { name: 'Rohan Saxena', rating: 4.5, text: 'Yahan sirf machines nahi chalti, therapist poora time saath rehte hain aur evidence-based physiotherapy protocol follow karte hain, isliye personalised feel aata hai.', category: 'Physiotherapy' },
  { name: 'Alka Devi', rating: 5.0, text: 'Knee replacement ke baad unka post-operative physiotherapy aur falls prevention program follow kiya, ab bina support ke araam se ghar ke stairs chadh leti hoon.', category: 'Falls Prevention' },
  { name: 'Mohit Batra', rating: 4.5, text: 'Late evening physiotherapy slots mil gaye isliye office ke baad bhi aapointement manage ho gayi, busy IT logon ke liye ye flexibility bohot helpful hai.', category: 'Physiotherapy' },
  { name: 'Pallavi Sinha', rating: 5.0, text: 'Har session ke baad woh progress aur next goal clearly likh ke dete hain, lagta hai proper structured physiotherapy program chal raha hai, random sessions nahi.', category: 'Physiotherapy' },
  { name: 'Gaganpreet Singh', rating: 4.5, text: 'Mujhe laga sirf exercises karwayenge, lekin unhone breathing, sleep aur hydration bhi include kiya; ekdum holistic physiotherapy approach jaisa services page pe likha hai.', category: 'Physiotherapy' },
  { name: 'Divya Menon', rating: 5.0, text: 'Chronic pain wale tough days par bhi therapist ne long-term rehab plan yaad dila ke gently push kiya, aise consistent support se hi real recovery hoti hai.', category: undefined },
  { name: 'Sameer Ali', rating: 4.5, text: 'Physiotherapy packages aur home visit charges pehle hi clearly explain kar diye, beech mein koi hidden cost nahi aaya, pricing bilkul transparent rahi.', category: 'Physiotherapy at Home' },
  { name: 'Kirti Chawla', rating: 5.0, text: 'Clinic ka interior aisa hai jaise rehab plus wellness studio, manual therapy aur osteopathy sessions ke dauran bhi spa jaisa calm feel aata hai.', category: 'Osteopathy' },
  { name: 'Ashish Thakur', rating: 4.5, text: 'Purani shoulder injury baarish mein dard karti thi, manual physical therapy aur targeted exercise therapy ke baad teen mahine se koi flare-up nahi hua.', category: 'Exercise Therapy' },
  { name: 'Ria Kapoor', rating: 5.0, text: 'Chronic back aur neck issues ke bawajood therapist patiently sunte hain, physiotherapy ke sath-sath lifestyle aur work habits pe bhi time se guidance dete hain.', category: 'Physiotherapy' },
  { name: 'Sagar Joshi', rating: 4.5, text: 'Exercise therapy aur posture correction tips se everyday tasks jaise laptop work, driving aur cooking bohot aasaan lagne lage, body pe load kam feel hota hai.', category: 'Exercise Therapy' },
  { name: 'Mona Arora', rating: 5.0, text: 'Main reviews dekh ke aayi thi aur yahan physiotherapy, osteopathy aur chiropractic jaise services ek hi roof ke neeche mil gaye, experience expectations se better nikla.', category: 'Osteopathy' },
  { name: 'Lokesh Verma', rating: 4.5, text: 'Reception se lekar physio tak sab polite hain, calmly explain karte hain ki mere liye clinic sessions better rahenge ya physiotherapy at home, decision lena easy ho gaya.', category: 'Physiotherapy at Home' },
  { name: 'Tanvi Arjun', rating: 5.0, text: 'PCOS ke saath weight gain aur joint pain ke liye womens health physiotherapy aur gradual exercise therapy plan mila, hormones ko shock kiye bina results dikhne lage.', category: 'Pelvic Floor & Women’s Health' },
  { name: 'Jatin Kohli', rating: 4.5, text: 'Har session pe pain score aur movement check karke physiotherapy ki intensity adjust karte hain, is evidence-based approach se trust naturally build ho jata hai.', category: 'Physiotherapy' },
  { name: 'Seema Nanda', rating: 5.0, text: 'Falls prevention aur strength training program ke baad ghar walon ne bhi notice kiya ki ab main zyada active ho gayi hoon, staircase aur market easily handle ho jata hai.', category: 'Falls Prevention' },
  { name: 'Varun Chawla', rating: 4.5, text: 'Guidance bilkul simple aur honest thi, structured physiotherapy plus home exercises se jo result pehle hi samjhaya tha wahi mila, koi overpromising nahi.', category: 'Physiotherapy at Home' },
]

const FEATURED_INDEX = 0
const INITIAL_VISIBLE = 8
const STEP = 8

/** Only real, verifiable numbers — computed from the reviews above. */
const totalReviews = reviews.length
const averageRating =
  Math.round(
    (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews) * 100,
  ) / 100
const fiveStar = reviews.filter((r) => r.rating === 5).length

export function Reviews() {
  const navigate = useNavigate()
  const [visible, setVisible] = useState(INITIAL_VISIBLE)

  const featured = useMemo(
    () => ({ ...reviews[FEATURED_INDEX], featured: true }),
    [],
  )
  const rest = reviews.slice(1)
  const shown = rest.slice(0, visible)
  const hasMore = visible < rest.length

  return (
    <div className="flex flex-col pb-20 md:pb-0">
      <PageHero
        eyebrow="Patient Experiences"
        title="Trusted by Patients on Their Recovery Journey"
        intro="Real feedback from the people who trusted us with their recovery — kuch simple English mein, kuch pure Hinglish mein — taaki aapko asli experience ka feel aaye."
      />

      {/* ── Rating highlight: real figures only ── */}
      <section className={`${sectionLight} ${dark.sectionLight}`}>
        <div className={`${container.content} py-16 lg:py-20`}>
          <RevealGroup className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-[20px] border border-sky-100 bg-white p-7 text-center shadow-[0_4px_18px_rgba(11,35,71,0.05)] dark:border-slate-800 dark:bg-slate-900">
              <p className="text-[44px] leading-none font-extrabold tracking-tight text-[#0B2347] lg:text-[52px] dark:text-white">
                {averageRating}
                <span className="text-[22px] text-slate-400">/5</span>
              </p>
              <p className="mt-3 text-[13px] font-semibold tracking-[0.18em] text-slate-500 uppercase dark:text-slate-400">
                Average rating
              </p>
            </div>

            <div className="rounded-[20px] border border-sky-100 bg-white p-7 text-center shadow-[0_4px_18px_rgba(11,35,71,0.05)] dark:border-slate-800 dark:bg-slate-900">
              <p className="text-[44px] leading-none font-extrabold tracking-tight text-[#0B2347] lg:text-[52px] dark:text-white">
                {totalReviews}
              </p>
              <p className="mt-3 text-[13px] font-semibold tracking-[0.18em] text-slate-500 uppercase dark:text-slate-400">
                Patient reviews
              </p>
            </div>

            <div className="rounded-[20px] border border-sky-100 bg-white p-7 text-center shadow-[0_4px_18px_rgba(11,35,71,0.05)] dark:border-slate-800 dark:bg-slate-900">
              <p className="text-[44px] leading-none font-extrabold tracking-tight text-[#0B2347] lg:text-[52px] dark:text-white">
                {fiveStar}
                <span className="text-[22px] text-slate-400">/{totalReviews}</span>
              </p>
              <p className="mt-3 text-[13px] font-semibold tracking-[0.18em] text-slate-500 uppercase dark:text-slate-400">
                Rated five stars
              </p>
            </div>
          </RevealGroup>
        </div>
      </section>

      {/* ── Featured + grid ── */}
      <section className={`${sectionTint} ${dark.sectionTint}`}>
        <div className={`${container.content} py-16 lg:py-20`}>
          <SectionHeading
            eyebrow="In Their Words"
            title="What recovery felt like"
            intro="One review in full, then the rest in a scannable grid."
          />

          {/* Featured review, wider than the grid cards */}
          <div className="mt-12 lg:mt-16">
            <TestimonialCard t={featured} />
          </div>

          <RevealGroup className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((t, i) => (
              <TestimonialCard
                key={`${t.name}-${i}`}
                t={t}
                // Only the first batch animates in on scroll. Anything added
                // by "Show more" renders straight away — the reveal group's
                // animation has already finished, so animating them would
                // leave them stuck at opacity 0 with a hole in the grid.
                animate={i < INITIAL_VISIBLE}
              />
            ))}
          </RevealGroup>

          {hasMore && (
            <div className="mt-12 flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={() => setVisible((v) => v + STEP)}
                className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-9 font-bold text-[#0B2347] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#087CF0] hover:text-[#087CF0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087CF0] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-sky-400 dark:hover:text-sky-400"
              >
                Show more reviews
                <span aria-hidden="true">↓</span>
              </button>
              <p className="text-[13px] text-slate-500 dark:text-slate-400">
                Showing {shown.length + 1} of {totalReviews}
              </p>
            </div>
          )}
        </div>
      </section>

      <CTASection
        eyebrow="Your Next Step"
        title="Your recovery journey starts here."
        body="Read what others experienced, then talk to a specialist about what is possible for you."
        primaryLabel="Book a Session"
        onPrimary={() => navigate('/contact')}
        secondaryLabel="Call 98781 82115"
        secondaryHref="tel:9878182115"
      />
    </div>
  )
}
