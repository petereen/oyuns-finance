"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";

const copy = {
  mn: {
    status: "ХУУДАС ОЛДСОНГҮЙ",
    code: "ШИЛЖҮҮЛЭГ / 404",
    title: "Энэ шилжүүлэг замдаа төөрчихлөө.",
    body: "Таны хайсан хуудас одоогоор байхгүй байна. Найдвартай замаар буцаж, хүссэн үйлчилгээгээ үргэлжлүүлээрэй.",
    action: "Нүүр хуудас руу буцах",
    transfer: "ШИЛЖҮҮЛГИЙН ЧИГЛЭЛ",
    pending: "Замдаа",
    from: "Орос",
    to: "Монгол",
    reference: "Гүйлгээний дугаар",
  },
  ru: {
    status: "СТРАНИЦА НЕ НАЙДЕНА",
    code: "ПЕРЕВОД / 404",
    title: "Этот перевод сбился с маршрута.",
    body: "Страница, которую вы ищете, сейчас недоступна. Вернитесь по надежному маршруту и продолжите с нужной услуги.",
    action: "Вернуться на главную",
    transfer: "МАРШРУТ ПЕРЕВОДА",
    pending: "В пути",
    from: "Россия",
    to: "Монголия",
    reference: "Номер операции",
  },
} as const;

function TransferIllustration({
  labels,
}: {
  labels: (typeof copy)[keyof typeof copy];
}) {
  return (
    <div className="oyuns-not-found__art" aria-hidden="true">
      <div className="oyuns-not-found__art-grid" />

      <div className="oyuns-not-found__logo-card">
        <span className="oyuns-not-found__art-label">ALL-IN-ONE</span>
        <Image src="/logo-main.svg" width={140} height={28} alt="" />
      </div>

      <div className="oyuns-not-found__route route-rub">
        <span className="oyuns-not-found__route-dot" />
        <span>{labels.from}</span>
        <strong>RUB</strong>
      </div>

      <div className="oyuns-not-found__route route-mnt">
        <span className="oyuns-not-found__route-dot" />
        <span>{labels.to}</span>
        <strong>MNT</strong>
      </div>

      <div className="oyuns-not-found__coin oyuns-not-found__coin--rub">
        <span>₽</span>
      </div>
      <div className="oyuns-not-found__coin oyuns-not-found__coin--mnt">
        <span>₮</span>
      </div>

      <svg className="oyuns-not-found__orbit" viewBox="0 0 560 420" fill="none">
        <path d="M77 261C136 79 414 55 487 205" />
        <path d="M480 205L469 188M480 205L460 207" />
        <path className="orbit-dash" d="M453 287C370 382 184 370 108 304" />
        <path d="M108 304L126 306M108 304L115 320" />
      </svg>

      <div className="oyuns-not-found__transfer-card">
        <div className="oyuns-not-found__transfer-head">
          <span>{labels.transfer}</span>
          <span className="oyuns-not-found__pending">
            <i /> {labels.pending}
          </span>
        </div>
        <div className="oyuns-not-found__transfer-values">
          <div className="oyuns-not-found__currency-block">
            <span className="oyuns-not-found__currency-icon currency-icon-rub">₽</span>
            <div>
              <small>RUB</small>
              <strong>100</strong>
            </div>
          </div>
          <span className="oyuns-not-found__swap-icon">→</span>
          <div className="oyuns-not-found__currency-block">
            <span className="oyuns-not-found__currency-icon currency-icon-mnt">₮</span>
            <div>
              <small>MNT</small>
              <strong>4,620</strong>
            </div>
          </div>
        </div>
        <div className="oyuns-not-found__transfer-foot">
          <span>{labels.reference}</span>
          <strong>OY-404</strong>
        </div>
      </div>

      <div className="oyuns-not-found__receipt">
        <span className="receipt-notch receipt-notch-left" />
        <span className="receipt-notch receipt-notch-right" />
        <span className="receipt-mark">✓</span>
        <span className="receipt-line receipt-line-short" />
        <span className="receipt-line" />
        <span className="receipt-line receipt-line-mid" />
      </div>

      <div className="oyuns-not-found__spark spark-one">+</div>
      <div className="oyuns-not-found__spark spark-two">+</div>
      <div className="oyuns-not-found__spark spark-three">•</div>
    </div>
  );
}

export default function NotFound() {
  const params = useParams<{ lang?: string }>();
  const lang = params?.lang === "ru" ? "ru" : "mn";
  const labels = copy[lang];

  return (
    <section className="oyuns-not-found">
      <div className="oyuns-not-found__panel">
        <div className="oyuns-not-found__panel-bar">
          <span className="oyuns-not-found__status">
            <i /> {labels.status}
          </span>
          <span className="oyuns-not-found__code">{labels.code}</span>
        </div>

        <div className="oyuns-not-found__layout">
          <div className="oyuns-not-found__copy">
            <p className="oyuns-not-found__number">404</p>
            <h1>{labels.title}</h1>
            <p className="oyuns-not-found__body">{labels.body}</p>
            <Link href={`/${lang}`} className="oyuns-not-found__button">
              {labels.action}
              <span aria-hidden="true">↗</span>
            </Link>
          </div>

          <TransferIllustration labels={labels} />
        </div>
      </div>
    </section>
  );
}
