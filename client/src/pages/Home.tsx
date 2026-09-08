import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  Clock3,
  FileText,
  LayoutDashboard,
  Mail,
  MapPin,
  Menu,
  NotebookPen,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users,
  X,
} from "lucide-react";

type ViewMode = "public" | "admin";
type Role = "lilia" | "samuel" | "margarita";
type AdminTab = "resumen" | "agenda" | "clientes" | "avisos";
type BookingStep = 1 | 2 | 3 | 4;

const services = [
  {
    name: "Diagnóstico y proyecto de pensión (números reales)",
    description: "Revisión de tu situación actual y proyección para tomar decisiones con claridad.",
    short: "Diagnóstico y proyecto",
  },
  {
    name: "Estrategia para mejorar tu pensión",
    description: "Un plan ordenado para identificar oportunidades antes de tu retiro.",
    short: "Estrategia de mejora",
  },
  {
    name: "Gestión y acompañamiento de trámites hasta la resolución",
    description: "Acompañamiento durante el proceso y seguimiento de cada avance.",
    short: "Gestión y acompañamiento",
  },
  {
    name: "Financiamiento Modalidad 40",
    description: "Orientación para entender si esta modalidad aplica a tu caso.",
    short: "Modalidad 40",
  },
  {
    name: "Financiamiento Modalidad 10",
    description: "Información clara para valorar esta alternativa de financiamiento.",
    short: "Modalidad 10",
  },
  {
    name: "Ayuda por Desempleo",
    description: "Revisión de requisitos y pasos para iniciar tu trámite.",
    short: "Ayuda por desempleo",
  },
  {
    name: "Planes Privados de Retiro",
    description: "Conversación inicial para conocer opciones de planeación personal.",
    short: "Planes privados",
  },
  {
    name: "Recupera tus semanas (cotizadas)",
    description: "Revisión de tu historial y alternativas para recuperar semanas.",
    short: "Recupera tus semanas",
  },
];

const appointmentData = {
  lilia: [
    { time: "09:00", name: "Mariana Cortés", service: "Diagnóstico y proyecto", status: "Confirmada", tone: "gold" },
    { time: "11:30", name: "Roberto Salgado", service: "Modalidad 40", status: "Confirmada", tone: "blue" },
    { time: "16:00", name: "Patricia Méndez", service: "Seguimiento de trámite", status: "Por confirmar", tone: "soft" },
  ],
  samuel: [
    { time: "10:00", name: "Jorge Velasco", service: "Seguimiento de trámite", status: "Confirmada", tone: "blue" },
    { time: "13:00", name: "Adriana Torres", service: "Recupera tus semanas", status: "Confirmada", tone: "gold" },
  ],
  margarita: [
    { time: "09:30", name: "Teresa Pacheco", service: "Estrategia de mejora", status: "Confirmada", tone: "gold" },
    { time: "15:30", name: "Enrique Luna", service: "Planes privados", status: "Por confirmar", tone: "soft" },
  ],
};

const roles: { id: Role; name: string; initials: string; access: string }[] = [
  { id: "lilia", name: "Lilia Reyes", initials: "LR", access: "Vista completa" },
  { id: "samuel", name: "Samuel Aguayo", initials: "SA", access: "Solo consulta" },
  { id: "margarita", name: "Margarita Reyes", initials: "MR", access: "Solo consulta" },
];

const dates = [
  { day: "Lun", number: "14", label: "14 de septiembre" },
  { day: "Mar", number: "15", label: "15 de septiembre" },
  { day: "Mié", number: "16", label: "16 de septiembre" },
  { day: "Jue", number: "17", label: "17 de septiembre" },
  { day: "Vie", number: "18", label: "18 de septiembre" },
];

const timeSlots = ["09:00", "10:30", "12:00", "16:00", "17:30"];

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`brand ${compact ? "brand-compact" : ""}`}>
      <div className="brand-mark">P<span>360</span></div>
      <div className="brand-copy">
        <strong>Pensión 360</strong>
        <span>Consultores</span>
      </div>
    </div>
  );
}

function Stepper({ step }: { step: BookingStep }) {
  const items = ["Servicio", "Fecha y hora", "Tus datos", "Confirmación"];
  return (
    <div className="stepper" aria-label="Progreso de la cita">
      {items.map((label, index) => {
        const number = index + 1;
        const current = number === step;
        const completed = number < step;
        return (
          <div className="stepper-item" key={label}>
            <div className={`step-dot ${current ? "is-current" : ""} ${completed ? "is-complete" : ""}`}>
              {completed ? <Check size={14} strokeWidth={3} /> : number}
            </div>
            <span className={current ? "step-label current" : "step-label"}>{label}</span>
            {index < items.length - 1 && <div className={`step-line ${completed ? "is-complete" : ""}`} />}
          </div>
        );
      })}
    </div>
  );
}

function PublicBooking({ onOpenAdmin }: { onOpenAdmin: () => void }) {
  const [step, setStep] = useState<BookingStep>(1);
  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", email: "" });

  const chosenService = services.find((service) => service.name === selectedService);
  const canContinue =
    (step === 1 && Boolean(selectedService)) ||
    (step === 2 && Boolean(selectedDate && selectedTime)) ||
    (step === 3 && Boolean(form.name && form.phone && form.email));

  const handleNext = () => {
    if (step < 4 && canContinue) setStep((current) => (current + 1) as BookingStep);
  };

  const handleBack = () => {
    if (step > 1) setStep((current) => (current - 1) as BookingStep);
  };

  const resetBooking = () => {
    setStep(1);
    setSelectedService("");
    setSelectedDate("");
    setSelectedTime("");
    setForm({ name: "", phone: "", email: "" });
  };

  return (
    <div className="public-shell">
      <header className="public-nav">
        <Brand />
        <div className="nav-right">
          <span className="demo-pill"><span className="live-dot" /> Demo privada</span>
          <button className="text-button" onClick={onOpenAdmin}>
            <LayoutDashboard size={16} /> Ver panel del equipo
          </button>
        </div>
      </header>

      <main className="public-main">
        <section className="public-intro">
          <div className="eyebrow"><ShieldCheck size={15} /> Atención con claridad y seguimiento</div>
          <h1>Tu siguiente paso hacia un retiro más tranquilo.</h1>
          <p className="intro-copy">
            Agenda una conversación con el equipo de Pensión 360. Elige el tema que quieres revisar y recibe la confirmación en tu correo.
          </p>
          <div className="intro-meta">
            <div className="meta-row"><MapPin size={17} /><span>Edificio SavaS · Cancún, Q.R.</span></div>
            <div className="meta-row"><Phone size={17} /><span>998 475 1154</span></div>
          </div>
          <div className="trust-note">
            <div className="trust-icon"><Users size={19} /></div>
            <div><strong>Tu información, en un solo lugar</strong><span>El equipo puede dar seguimiento a cada visita y trámite.</span></div>
          </div>
        </section>

        <section className="booking-card">
          <div className="booking-head">
            <div>
              <span className="card-kicker">Agenda tu cita</span>
              <h2>{step === 4 ? "Cita confirmada" : "Comencemos"}</h2>
            </div>
            <div className="single-agent"><span className="avatar avatar-gold">LR</span><span><b>Lilia Reyes</b><small>Atención a clientes nuevos</small></span></div>
          </div>
          <Stepper step={step} />

          <div className="booking-body">
            {step === 1 && (
              <div className="step-panel step-panel-services">
                <div className="panel-title"><span>01</span><div><h3>¿Qué quieres revisar?</h3><p>Selecciona el tema principal de tu cita.</p></div></div>
                <div className="service-list">
                  {services.map((service) => (
                    <button key={service.name} className={`service-option ${selectedService === service.name ? "selected" : ""}`} onClick={() => setSelectedService(service.name)}>
                      <span className="service-radio">{selectedService === service.name && <span />}</span>
                      <span className="service-copy"><strong>{service.name}</strong><small>{service.description}</small></span>
                      <ArrowRight size={17} className="service-arrow" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="step-panel">
                <div className="panel-title"><span>02</span><div><h3>Elige fecha y hora</h3><p>Selecciona un espacio disponible con Lilia Reyes.</p></div></div>
                <div className="selected-summary"><span className="summary-icon"><FileText size={17} /></span><span><small>Servicio seleccionado</small><strong>{chosenService?.short}</strong></span><button onClick={() => setStep(1)}>Cambiar</button></div>
                <div className="date-picker-label"><CalendarDays size={17} /> Septiembre 2026</div>
                <div className="date-grid">
                  {dates.map((date, index) => (
                    <button key={date.number} className={`date-option ${selectedDate === date.label ? "selected" : ""}`} onClick={() => setSelectedDate(date.label)}>
                      <span>{date.day}</span><strong>{date.number}</strong>{index === 1 && <small>Más elegido</small>}
                    </button>
                  ))}
                </div>
                <div className="time-grid">
                  {timeSlots.map((time, index) => (
                    <button key={time} className={`time-option ${selectedTime === time ? "selected" : ""} ${index === 2 ? "muted-slot" : ""}`} onClick={() => setSelectedTime(time)} disabled={index === 2}>
                      <Clock3 size={15} /> {time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="step-panel">
                <div className="panel-title"><span>03</span><div><h3>¿Cómo te contactamos?</h3><p>Necesitamos estos datos para confirmar y enviarte el recordatorio.</p></div></div>
                <div className="selected-summary appointment-summary"><span className="summary-icon"><CalendarDays size={17} /></span><span><small>{selectedDate} · {selectedTime}</small><strong>{chosenService?.short}</strong></span><button onClick={() => setStep(2)}>Cambiar</button></div>
                <div className="form-grid">
                  <label><span>Nombre completo</span><input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Ej. María González" /></label>
                  <label><span>Teléfono</span><input type="tel" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="10 dígitos" /></label>
                  <label className="full-field"><span>Correo electrónico <em>Obligatorio</em></span><input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="tu@correo.com" /><small>Te enviaremos aquí la confirmación y el recordatorio.</small></label>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="step-panel confirmation-panel">
                <div className="success-seal"><Check size={30} strokeWidth={2.5} /></div>
                <h3>Listo, {form.name.split(" ")[0] || "tu cita"}.</h3>
                <p>Tu solicitud quedó registrada en esta demo. El siguiente paso sería enviar la confirmación real por correo.</p>
                <div className="confirmation-details">
                  <div><small>Servicio</small><strong>{chosenService?.short}</strong></div>
                  <div><small>Fecha y hora</small><strong>{selectedDate} · {selectedTime}</strong></div>
                  <div><small>Atiende</small><strong>Lilia Reyes</strong></div>
                </div>
                <div className="email-notice"><Mail size={18} /><span>En un sistema real, {form.email || "tu correo"} recibiría un aviso de confirmación y un recordatorio.</span></div>
                <button className="secondary-button" onClick={resetBooking}>Hacer otra demostración</button>
              </div>
            )}
          </div>

          {step < 4 && (
            <div className="booking-footer">
              {step > 1 ? <button className="back-button" onClick={handleBack}><ArrowLeft size={16} /> Atrás</button> : <span className="required-note">Todos los campos son obligatorios</span>}
              <button className="primary-button" disabled={!canContinue} onClick={handleNext}>{step === 3 ? "Confirmar cita" : "Continuar"}<ArrowRight size={17} /></button>
            </div>
          )}
        </section>
      </main>

      <footer className="public-footer"><span>© Pensión 360 Consultores</span><span>Esta es una demo de experiencia · Sin costos mostrados</span></footer>
    </div>
  );
}

function Metric({ icon, label, value, note, tone }: { icon: React.ReactNode; label: string; value: string; note: string; tone: string }) {
  return <div className="metric-card"><div className={`metric-icon ${tone}`}>{icon}</div><div className="metric-copy"><span>{label}</span><strong>{value}</strong><small>{note}</small></div></div>;
}

function AppointmentList({ role }: { role: Role }) {
  const appointments = appointmentData[role];
  return (
    <div className="appointment-list">
      {appointments.map((appointment) => (
        <div className="appointment-row" key={`${appointment.time}-${appointment.name}`}>
          <span className="appointment-time">{appointment.time}</span>
          <span className={`appointment-dot ${appointment.tone}`} />
          <div className="appointment-person"><strong>{appointment.name}</strong><span>{appointment.service}</span></div>
          <span className={`status ${appointment.status === "Confirmada" ? "status-confirmed" : "status-pending"}`}>{appointment.status}</span>
        </div>
      ))}
    </div>
  );
}

function AdminDashboard({ onExit }: { onExit: () => void }) {
  const [role, setRole] = useState<Role>("lilia");
  const [tab, setTab] = useState<AdminTab>("resumen");
  const [showNote, setShowNote] = useState(false);
  const [note, setNote] = useState("");
  const currentRole = roles.find((item) => item.id === role)!;
  const canEdit = role === "lilia";

  const navItems: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: "resumen", label: "Resumen", icon: <LayoutDashboard size={17} /> },
    { id: "agenda", label: "Agenda", icon: <CalendarDays size={17} /> },
    { id: "clientes", label: "Clientes", icon: <Users size={17} /> },
    { id: "avisos", label: "Avisos por correo", icon: <Mail size={17} /> },
  ];

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="sidebar-top"><Brand compact /><button className="sidebar-close"><Menu size={19} /></button></div>
        <div className="sidebar-context"><span className="sidebar-label">Espacio de trabajo</span><div className="workspace-switch"><span className="workspace-mark">P</span><span><strong>Pensión 360</strong><small>Consultores</small></span><ChevronDown size={15} /></div></div>
        <nav className="admin-nav">{navItems.map((item) => <button key={item.id} className={tab === item.id ? "active" : ""} onClick={() => setTab(item.id)}>{item.icon}<span>{item.label}</span>{item.id === "avisos" && <b className="nav-count">3</b>}</button>)}</nav>
        <div className="sidebar-help"><Sparkles size={18} /><strong>Todo en contexto</strong><span>Notas, seguimientos y citas relacionadas en el mismo lugar.</span></div>
        <div className="sidebar-bottom"><div className="mini-user"><span className="avatar avatar-navy">{currentRole.initials}</span><span><strong>{currentRole.name}</strong><small>{currentRole.access}</small></span></div><button className="exit-button" onClick={onExit}><ArrowLeft size={16} /> Ver agenda pública</button></div>
      </aside>

      <main className="admin-content">
        <header className="admin-header"><div><span className="breadcrumb">Pensión 360 / {navItems.find((item) => item.id === tab)?.label}</span><h1>{tab === "resumen" ? "Buenos días, equipo." : navItems.find((item) => item.id === tab)?.label}</h1></div><div className="admin-header-actions"><button className="icon-button"><Search size={18} /></button><button className="icon-button notification-button"><Bell size={18} /><span /></button><div className="header-divider" /><div className="role-select"><span className="avatar avatar-navy">{currentRole.initials}</span><select value={role} onChange={(event) => setRole(event.target.value as Role)} aria-label="Cambiar integrante"><option value="lilia">Lilia Reyes</option><option value="samuel">Samuel Aguayo</option><option value="margarita">Margarita Reyes</option></select><ChevronDown size={15} /></div></div></header>
        <div className="admin-scroll">
          {!canEdit && <div className="access-banner"><ShieldCheck size={18} /><span><strong>Panel de consulta</strong> · Aquí puedes consultar tu calendario y notas. El flujo público asigna citas nuevas a Lilia Reyes.</span></div>}
          {tab === "resumen" && <SummaryTab role={role} canEdit={canEdit} showNote={showNote} setShowNote={setShowNote} note={note} setNote={setNote} />}
          {tab === "agenda" && <AgendaTab role={role} />}
          {tab === "clientes" && <ClientsTab role={role} />}
          {tab === "avisos" && <EmailTab />}
        </div>
      </main>
    </div>
  );
}

function SummaryTab({ role, canEdit, showNote, setShowNote, note, setNote }: { role: Role; canEdit: boolean; showNote: boolean; setShowNote: (value: boolean) => void; note: string; setNote: (value: string) => void }) {
  const roleName = roles.find((item) => item.id === role)?.name;
  return (
    <>
      <div className="date-context"><div><span className="eyebrow">Martes 8 de septiembre de 2026</span><h2>Tu agenda, sin perder el contexto.</h2></div><button className="outline-button"><CalendarDays size={16} /> Ver calendario completo</button></div>
      <div className="metric-grid"><Metric icon={<CalendarDays size={19} />} label="Citas esta semana" value="12" note="3 pendientes de confirmar" tone="gold" /><Metric icon={<Clock3 size={19} />} label="Seguimientos próximos" value="4" note="En los próximos 7 días" tone="blue" /><Metric icon={<Users size={19} />} label="Clientes activos" value="28" note="Con historial registrado" tone="green" /><Metric icon={<Mail size={19} />} label="Avisos por enviar" value="3" note="Recordatorios automáticos" tone="peach" /></div>
      <div className="dashboard-grid">
        <section className="dashboard-card agenda-card"><div className="card-heading"><div><span className="section-kicker">Agenda de hoy</span><h3>{roleName}</h3></div><button className="small-link">Ver todo <ArrowRight size={14} /></button></div><AppointmentList role={role} /></section>
        <section className="dashboard-card followup-card"><div className="card-heading"><div><span className="section-kicker">Cliente destacado</span><h3>Mariana Cortés</h3></div><span className="followup-tag"><Clock3 size={13} /> Seguimiento</span></div><div className="client-profile"><span className="large-avatar">MC</span><div><strong>Diagnóstico y proyecto</strong><span>Última visita · 28 de agosto</span></div></div><div className="next-appointment"><div className="next-date"><strong>18</strong><span>SEP</span></div><div><small>Próxima cita de seguimiento</small><strong>Viernes · 11:30</strong></div><ArrowRight size={17} /></div><div className="note-preview"><NotebookPen size={16} /><p>“Revisar semanas cotizadas y preparar comparativo para la siguiente conversación.”</p></div><div className="history-line"><div className="history-item done"><span>1</span><div><strong>Diagnóstico inicial</strong><small>12 de agosto · Completada</small></div></div><div className="history-item done"><span>2</span><div><strong>Revisión de documentos</strong><small>28 de agosto · Completada</small></div></div><div className="history-item upcoming"><span>3</span><div><strong>Seguimiento</strong><small>18 de septiembre · Próxima</small></div></div></div>{canEdit ? <>{!showNote ? <button className="add-note-button" onClick={() => setShowNote(true)}><Plus size={16} /> Agregar nota de visita</button> : <div className="note-composer"><div className="composer-title"><span>Nota de visita</span><button onClick={() => setShowNote(false)}><X size={15} /></button></div><textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Escribe qué se revisó o cuál es el siguiente paso..." /><button className="save-note" onClick={() => setShowNote(false)}>Guardar nota</button></div>}</> : <div className="read-only-note"><ShieldCheck size={15} /> Las notas se pueden consultar desde este panel</div>}</section>
      </div>
    </>
  );
}

function AgendaTab({ role }: { role: Role }) {
  const calendarDays = useMemo(() => Array.from({ length: 30 }, (_, index) => index + 1), []);
  const dots = new Set([3, 8, 10, 14, 15, 18, 21, 24, 28]);
  return <div className="agenda-view"><div className="section-toolbar"><div><span className="section-kicker">Agenda mensual</span><h2>Septiembre 2026</h2></div><div className="toolbar-actions"><button className="icon-button"><ChevronLeft size={17} /></button><button className="today-button">Hoy</button><button className="icon-button"><ChevronRight size={17} /></button></div></div><div className="calendar-layout"><div className="calendar-card"><div className="weekdays">{["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day) => <span key={day}>{day}</span>)}</div><div className="calendar-grid">{Array.from({ length: 1 }).map((_, index) => <span key={`blank-${index}`} className="calendar-day blank" />)}{calendarDays.map((day) => <button key={day} className={`calendar-day ${day === 8 ? "today" : ""} ${day === 18 ? "selected-day" : ""}`}><span>{day}</span>{dots.has(day) && <i />}</button>)}</div></div><div className="day-detail"><span className="section-kicker">Viernes 18 de septiembre</span><h3>3 citas</h3><AppointmentList role={role} /><button className="primary-button wide-button"><Plus size={16} /> Agregar cita manual</button></div></div></div>;
}

function ClientsTab({ role }: { role: Role }) {
  const clients = role === "lilia" ? [
    ["MC", "Mariana Cortés", "Diagnóstico y proyecto", "Próxima cita · 18 sep", "gold"],
    ["RS", "Roberto Salgado", "Modalidad 40", "Próxima cita · 22 sep", "blue"],
    ["PM", "Patricia Méndez", "Seguimiento de trámite", "Sin próxima cita", "peach"],
    ["AG", "Arturo García", "Recupera tus semanas", "Próxima cita · 25 sep", "green"],
  ] : role === "samuel" ? [["JV", "Jorge Velasco", "Seguimiento de trámite", "Próxima cita · 19 sep", "blue"], ["AT", "Adriana Torres", "Recupera tus semanas", "Próxima cita · 24 sep", "gold"]] : [["TP", "Teresa Pacheco", "Estrategia de mejora", "Próxima cita · 20 sep", "gold"], ["EL", "Enrique Luna", "Planes privados", "Sin próxima cita", "peach"]];
  return <div className="clients-view"><div className="section-toolbar"><div><span className="section-kicker">Historial de clientes</span><h2>{clients.length} clientes asignados</h2></div><div className="search-box"><Search size={16} /><input placeholder="Buscar cliente" /></div></div><div className="client-list">{clients.map(([initials, name, service, next, tone]) => <button className="client-row" key={name}><span className={`large-avatar ${tone}`}>{initials}</span><span className="client-row-copy"><strong>{name}</strong><small>{service}</small></span><span className="client-next"><small>{next.includes("Sin") ? "Seguimiento" : "Próxima cita"}</small><strong className={next.includes("Sin") ? "muted-text" : ""}>{next.replace("Próxima cita · ", "").replace("Sin próxima cita", "Por definir")}</strong></span><ArrowRight size={17} /></button>)}</div></div>;
}

function EmailTab() {
  return <div className="email-view"><div className="section-toolbar"><div><span className="section-kicker">Automatizaciones</span><h2>Vista previa del aviso</h2></div><span className="preview-tag"><EyeIcon /> Solo vista previa</span></div><div className="email-layout"><div className="email-list"><div className="email-list-title">Avisos recientes <span>3</span></div><button className="email-list-item selected"><span className="email-status-dot" /><span><strong>Recordatorio de cita</strong><small>Mariana Cortés · En 2 días</small></span><ChevronRight size={15} /></button><button className="email-list-item"><span className="email-status-dot pending" /><span><strong>Confirmación de cita</strong><small>Roberto Salgado · Enviado</small></span><ChevronRight size={15} /></button><button className="email-list-item"><span className="email-status-dot pending" /><span><strong>Seguimiento próximo</strong><small>Patricia Méndez · Mañana</small></span><ChevronRight size={15} /></button></div><div className="email-preview"><div className="mail-window-bar"><span /><span /><span /><small>Vista previa del correo</small></div><div className="mail-paper"><div className="mail-brand"><div className="brand-mark">P<span>360</span></div><span>Pensión 360 Consultores</span></div><div className="mail-body"><span className="mail-eyebrow">RECORDATORIO DE CITA</span><h3>Te esperamos, Mariana.</h3><p>Este es un recordatorio de tu próxima cita con Pensión 360 Consultores.</p><div className="mail-event"><div className="mail-event-date"><strong>18</strong><span>SEP</span></div><div><strong>Diagnóstico y proyecto</strong><span>Viernes 18 de septiembre · 11:30</span><span>Con Lilia Reyes</span></div></div><p className="mail-muted">Si necesitas cambiar tu cita, puedes comunicarte con nosotros al 998 475 1154.</p><div className="mail-button">Ver detalles de mi cita</div></div><div className="mail-footer">Pensión 360 Consultores · Cancún, Quintana Roo<br />Este mensaje es una vista previa de la demo.</div></div></div></div></div>;
}

function EyeIcon() { return <span className="eye-icon"><CircleUserRound size={13} /></span>; }

export default function Home() {
  const [view, setView] = useState<ViewMode>("public");
  return view === "public" ? <PublicBooking onOpenAdmin={() => setView("admin")} /> : <AdminDashboard onExit={() => setView("public")} />;
}
