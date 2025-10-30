function Frame3() {
  return (
    <div className="absolute bg-[#ffb362] box-border content-stretch flex gap-[10px] h-[84.491px] items-center justify-center left-[909.99px] px-[73px] py-[6px] rounded-[50px] top-[648.77px] w-[370.295px]">
      <p className="font-['Impact:Regular',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[40px] text-center text-nowrap text-white whitespace-pre">
        Log In
      </p>
    </div>
  );
}

function Key() {
  return <div className="absolute h-[49px] left-[271px] top-[90px] w-[51px]" data-name="key" />;
}

function Frame1() {
  return (
    <div className="absolute h-[111px] left-[902px] top-[441px] w-[394px]">
      <Key />
      <p className="[text-underline-position:from-font] absolute decoration-solid font-['Alumni_Sans:Regular',_sans-serif] font-normal h-[32px] leading-[normal] left-[247px] text-[#00306e] text-[25px] top-[146px] underline w-[137px]">
        Forgot password?
      </p>
    </div>
  );
}

export default function HighFiLogin() {
  return (
    <div className="bg-white relative size-full" data-name="High-Fi login">
      <div className="absolute bg-[#00306e] h-[1024px] left-0 top-0 w-[752px]" />

      <div
        className="absolute flex h-[calc(1px*((var(--transform-inner-width)*0.006124263629317284)+(var(--transform-inner-height)*0.9999844431877136)))] items-center justify-center left-[188.33px] top-[179.78px] w-[calc(1px*((var(--transform-inner-height)*0.0055775828659534454)+(var(--transform-inner-width)*0.9999812245368958)))]"
        style={{ "--transform-inner-width": "370.28125", "--transform-inner-height": "686.890625" }}
      >
        <div className="flex-none rotate-[359.649deg] skew-x-[359.969deg]">
          <div className="bg-white h-[686.897px] w-[370.295px]" data-name="Rectangle" />
        </div>
      </div>

      <p className="absolute font-['Impact:Regular',_sans-serif] h-[75px] leading-[normal] left-[1097.5px] not-italic text-[50px] text-black text-center top-[203px] translate-x-[-50%] w-[231px]">
        HELLO!
      </p>

      <div className="absolute font-['Impact:Regular',_sans-serif] h-[75px] leading-[normal] left-[1099px] not-italic text-[20px] text-black text-center top-[265px] translate-x-[-50%] w-[618px]">
        <p className="mb-0">Please enter your</p>
        <p>information below.</p>
      </div>

      <p className="absolute font-['Alumni_Sans:Regular',_sans-serif] font-normal h-[39px] leading-[normal] left-[914px] text-[25px] text-black top-[340px] w-[96px]">
        UF Email
      </p>

      <div className="absolute font-['Impact:Regular',_sans-serif] h-[174px] leading-[normal] left-[375.5px] not-italic text-[50px] text-black text-center top-[470px] translate-x-[-50%] w-[505px]">
        <p className="mb-0">WELCOME TO</p>
        <p>GATOR MARKET</p>
      </div>

      <div
        className="absolute flex h-[calc(1px*((var(--transform-inner-width)*0.006124263629317284)+(var(--transform-inner-height)*0.9999844431877136)))] items-center justify-center left-[913.51px] top-[373.08px] w-[calc(1px*((var(--transform-inner-height)*0.0055775828659534454)+(var(--transform-inner-width)*0.9999812245368958)))]"
        style={{ "--transform-inner-width": "370.28125", "--transform-inner-height": "84.484375" }}
      >
        <div className="flex-none rotate-[359.649deg] skew-x-[359.969deg]">
          <div className="bg-white h-[84.491px] relative w-[370.295px]" data-name="Rectangle">
            <div aria-hidden="true" className="absolute border-2 border-[#00306e] border-solid inset-0 pointer-events-none" />
          </div>
        </div>
      </div>

      <p className="absolute font-['Alumni_Sans:Regular',_sans-serif] font-normal h-[39px] leading-[normal] left-[914px] text-[25px] text-black top-[467px] w-[96px]">
        Password
      </p>

      <div
        className="absolute flex h-[calc(1px*((var(--transform-inner-width)*0.006124263629317284)+(var(--transform-inner-height)*0.9999844431877136)))] items-center justify-center left-[913.51px] top-[498.62px] w-[calc(1px*((var(--transform-inner-height)*0.0055775828659534454)+(var(--transform-inner-width)*0.9999812245368958)))]"
        style={{ "--transform-inner-width": "370.75", "--transform-inner-height": "84.484375" }}
      >
        <div className="flex-none rotate-[359.649deg] skew-x-[359.969deg]">
          <div className="bg-white h-[84.491px] relative w-[370.76px]" data-name="Rectangle">
            <div aria-hidden="true" className="absolute border-2 border-[#00306e] border-solid inset-0 pointer-events-none" />
          </div>
        </div>
      </div>

      <p className="absolute font-['Alumni_Sans:Regular',_sans-serif] font-normal h-[54px] leading-[normal] left-[375.5px] text-[45px] text-black text-center top-[595px] translate-x-[-50%] w-[387px]">
        By students, for students
      </p>

      <Frame3 />

      <p className="[text-underline-position:from-font] absolute decoration-solid font-['Alumni_Sans:Regular',_sans-serif] font-normal h-[39px] leading-[normal] left-[1095px] text-[25px] text-black text-center top-[740px] translate-x-[-50%] underline w-[286px]">
        New here? Create an account!
      </p>

      <Frame1 />

      <div className="absolute left-[311px] size-[128px] top-[291px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 128 128">
          <circle cx="64" cy="64" fill="var(--fill-0, #FFB362)" id="Ellipse 3" r="64" />
        </svg>
      </div>
    </div>
  );
}
