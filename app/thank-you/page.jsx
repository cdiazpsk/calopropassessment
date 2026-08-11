'use client';

import Header from '../../components/Header';

const CALIBER_EMAIL = 'info@caliberlodging.com';
const CALIBER_PHONE_DISPLAY = '1-833-425-2776';
const CALIBER_PHONE_LINK = '+18334252776';

export default function ThankYouPage() {
  return (
    <>
      <Header />
      <main style={{maxWidth:760,margin:'0 auto',padding:'64px 20px'}}>
        <section className="card" style={{padding:'42px 30px',textAlign:'center'}}>
          <div
            aria-hidden="true"
            style={{
              width:64,
              height:64,
              margin:'0 auto 20px',
              borderRadius:'50%',
              background:'#EAF4FF',
              color:'#0F67B1',
              display:'grid',
              placeItems:'center',
              fontSize:34,
              fontWeight:900,
            }}
          >
            &#10003;
          </div>

          <p className="kicker">Assessment Received</p>
          <h1 className="h1" style={{marginBottom:14}}>Thank You</h1>
          <p style={{fontSize:18,lineHeight:1.65,color:'#334155',maxWidth:610,margin:'0 auto'}}>
            Thank you for completing the Caliber Lodging Property Assessment. Our team will review the information you provided, and a member of the Caliber Lodging team will contact you shortly to discuss your property and next steps.
          </p>

          <div style={{marginTop:28,padding:20,borderRadius:14,background:'#f8fafc'}}>
            <strong style={{display:'block',color:'#0B2F5B',fontSize:17,marginBottom:8}}>
              Would you like to speak with us directly?
            </strong>
            <p style={{margin:0,color:'#475569',lineHeight:1.7}}>
              Email us at{' '}
              <a href={`mailto:${CALIBER_EMAIL}`} style={{color:'#0F67B1',fontWeight:800}}>
                {CALIBER_EMAIL}
              </a>
              {' '}or call{' '}
              <a href={`tel:${CALIBER_PHONE_LINK}`} style={{color:'#0F67B1',fontWeight:800}}>
                {CALIBER_PHONE_DISPLAY}
              </a>.
            </p>
          </div>

          <a className="btn-primary" href="/" style={{display:'inline-block',marginTop:28,textDecoration:'none'}}>
            Return to Home
          </a>
        </section>
      </main>
    </>
  );
}
