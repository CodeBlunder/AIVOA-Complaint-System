import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ── Animated counter hook ────────────────────────────────────────
function useCounter(target, duration = 1500) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

// ── Stat card ────────────────────────────────────────────────────
function StatCard({ value, suffix, label, color }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '2rem', fontWeight: 800, color, letterSpacing: '-1px' }}>
        {value}{suffix}
      </div>
      <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 4, fontWeight: 500 }}>
        {label}
      </div>
    </div>
  );
}

// ── Stage card ───────────────────────────────────────────────────
function StageCard({ number, title, description, metric, icon }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: 16,
      padding: '28px 24px',
      flex: 1,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: '#f0f4ff', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        fontSize: '1.1rem', marginBottom: 16,
      }}>
        {icon}
      </div>
      <div style={{ fontSize: '0.65rem', color: '#6366f1', fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
        Stage {number}
      </div>
      <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>
        {title}
      </div>
      <div style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.6, marginBottom: 16 }}>
        {description}
      </div>
      <div style={{ fontSize: '0.72rem', color: '#6366f1', fontWeight: 600 }}>
        {metric}
      </div>
    </div>
  );
}

// ── Compliance badge ─────────────────────────────────────────────
function ComplianceBadge({ title, subtitle, tag }) {
  return (
    <div style={{
      background: '#fff', border: '1px solid #e2e8f0',
      borderRadius: 12, padding: '18px 20px',
    }}>
      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
        {title}
      </div>
      <div style={{ fontSize: '0.68rem', color: '#64748b', lineHeight: 1.5, marginBottom: 10 }}>
        {subtitle}
      </div>
      <span style={{
        fontSize: '0.6rem', fontWeight: 700, color: '#6366f1',
        background: '#eef2ff', padding: '3px 8px', borderRadius: 20,
      }}>
        {tag}
      </span>
    </div>
  );
}

// ── Main Landing Page ────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate();
  const faster   = useCounter(94);
  const ready    = useCounter(100);

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>

      {/* ── NAV ─────────────────────────────────────────────── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #e2e8f0',
        padding: '0 5%', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between',
        height: 56,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, background: '#6366f1',
            borderRadius: 8, display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: '#fff', fontSize: '0.75rem', fontWeight: 800,
          }}>A</div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>AIVOA</div>
            <div style={{ fontSize: '0.55rem', color: '#94a3b8', lineHeight: 1 }}>QMS · Complaint Module</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontSize: '0.65rem', fontWeight: 600, color: '#6366f1',
            background: '#eef2ff', padding: '4px 10px', borderRadius: 20,
          }}>
            FDA 21 CFR Part 211.198 · 21 CFR Part 11 · ALCOA+ Standards
          </span>
          <button
            onClick={() => navigate('/login')}
            style={{
              background: '#6366f1', color: '#fff', border: 'none',
              borderRadius: 8, padding: '7px 16px', fontSize: '0.78rem',
              fontWeight: 600, cursor: 'pointer',
            }}>
            Sign In / QA Portal
          </button>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{
        padding: '80px 5% 60px',
        textAlign: 'center',
        background: 'linear-gradient(180deg, #fff 0%, #f8fafc 100%)',
        borderBottom: '1px solid #e2e8f0',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: '#eef2ff', border: '1px solid #c7d2fe',
          borderRadius: 20, padding: '5px 14px', marginBottom: 28,
        }}>
          <div style={{ width: 6, height: 6, background: '#6366f1', borderRadius: '50%' }} />
          <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#6366f1' }}>
            Built for Regulated Life Sciences — GxP Ready
          </span>
        </div>

        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3.2rem)',
          fontWeight: 800, color: '#0f172a',
          lineHeight: 1.15, maxWidth: 720,
          margin: '0 auto 20px', letterSpacing: '-1.5px',
        }}>
          Automate Pharma Complaint Intake<br />
          from{' '}
          <span style={{ color: '#6366f1' }}>Unstructured Natural Language</span>
          {' '}in Seconds.
        </h1>

        <p style={{
          fontSize: '0.95rem', color: '#475569', maxWidth: 560,
          margin: '0 auto 36px', lineHeight: 1.7,
        }}>
          Say goodbye to manual field-by-field entry and investigation backlogs.
          QA officers paste unstructured complaint text, and our LangGraph AI engine
          extracts batch genealogy, assigns severity, and writes audit-ready GxP records instantly.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 56 }}>
          <button
            onClick={() => navigate('/register')}
            style={{
              background: '#6366f1', color: '#fff', border: 'none',
              borderRadius: 10, padding: '12px 24px',
              fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
            🏥 Enter QA Officer Workspace
          </button>
          <button
            onClick={() => navigate('/login')}
            style={{
              background: '#fff', color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: 10, padding: '12px 24px',
              fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
            ▶ Watch 2-Min Regulatory Demo
          </button>
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex', gap: 48, justifyContent: 'center',
          flexWrap: 'wrap', padding: '24px 0',
          borderTop: '1px solid #e2e8f0',
        }}>
          <StatCard value={faster} suffix="%" label="Faster Complaint Triage" color="#6366f1" />
          <StatCard value={ready} suffix="%" label="Audit-Ready Records" color="#10b981" />
          <StatCard value="< 1.2" suffix="s" label="Groq LLM Inference" color="#f59e0b" />
          <StatCard value="Zero" suffix="" label="Missed Critical Batches" color="#ef4444" />
        </div>
      </section>

      {/* ── INTERACTIVE CONSOLE SIMULATION ──────────────────── */}
      <section style={{ padding: '64px 5%', background: '#f8fafc' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ marginBottom: 8 }}>
            <span style={{
              fontSize: '0.65rem', fontWeight: 700, color: '#6366f1',
              textTransform: 'uppercase', letterSpacing: 1,
            }}>
              Live System Simulation
            </span>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>
            Interactive Intake Console
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: 32 }}>
            Experience how LangGraph transforms raw clinical complaint text into fully mapped, regulated GMS records.
          </p>

          {/* Console window */}
          <div style={{
            background: '#fff', border: '1px solid #e2e8f0',
            borderRadius: 16, overflow: 'hidden',
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          }}>
            {/* Window chrome */}
            <div style={{
              background: '#f1f5f9', padding: '10px 16px',
              display: 'flex', alignItems: 'center', gap: 6,
              borderBottom: '1px solid #e2e8f0',
            }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
              <span style={{ marginLeft: 8, fontSize: '0.7rem', color: '#64748b', fontWeight: 500 }}>
                Log Customer Complaint — API & FDF Quality Assurance Module
              </span>
            </div>

            <div style={{ display: 'flex', minHeight: 420 }}>
              {/* Left — AI Tools */}
              <div style={{
                width: 280, borderRight: '1px solid #e2e8f0',
                padding: 20, background: '#fafafa', flexShrink: 0,
              }}>
                {/* AI Log Complaint */}
                <div style={{
                  background: '#fff', border: '1px solid #e0e7ff',
                  borderRadius: 12, padding: 14, marginBottom: 12,
                }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#4f46e5', marginBottom: 8 }}>
                    ✦ AI Log Complaint
                  </div>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 8, flexWrap: 'wrap' }}>
                    {['Example 1: Metformin 500mg', 'Example 2: Cefixime Particles', 'Example 3: Amoxicillin Qty'].map((ex, i) => (
                      <span key={i} style={{
                        fontSize: '0.58rem', background: '#eef2ff', color: '#6366f1',
                        padding: '2px 7px', borderRadius: 10, fontWeight: 600,
                      }}>{ex}</span>
                    ))}
                  </div>
                  <div style={{
                    fontSize: '0.7rem', color: '#374151', background: '#f8fafc',
                    border: '1px solid #e2e8f0', borderRadius: 8,
                    padding: '8px 10px', lineHeight: 1.6, marginBottom: 10,
                  }}>
                    URGENT COMPLAINT: Sun Pharma distributor notified us that Dr. S. Patel at St. Jude Regional Hospital Oncology Pharmacy reported mottled dark yellow-to-brownish discolouration and scaled blister surfaces on Metformin Hydrochloride Tablets 500mg (Lot: B0904-1552, Exp: Dec 31 2025). Approximately 1,200 blister cards (17,000 tablets) affected across three oncology wards...
                  </div>
                  <button style={{
                    width: '100%', background: '#6366f1', color: '#fff',
                    border: 'none', borderRadius: 8, padding: '8px 0',
                    fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer',
                  }}>
                    ✦ Auto-Fill Form with LangGraph
                  </button>
                </div>

                {/* Document Upload */}
                <div style={{
                  background: '#fff', border: '1px solid #e2e8f0',
                  borderRadius: 12, padding: 14, marginBottom: 12,
                }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 600, color: '#374151', marginBottom: 8 }}>
                    OR DROP SUPPORTING RECORDS
                  </div>
                  <div style={{
                    border: '1.5px dashed #cbd5e1', borderRadius: 8,
                    padding: '16px 10px', textAlign: 'center',
                  }}>
                    <div style={{ fontSize: '1.2rem', marginBottom: 4 }}>📄</div>
                    <div style={{ fontSize: '0.65rem', color: '#64748b' }}>
                      Drag & drop pharmaceutical documentation
                    </div>
                    <div style={{ fontSize: '0.58rem', color: '#94a3b8', marginTop: 4 }}>
                      PDF, DOCX, TXT, Scans, Lab Photos (Up to 25MB)
                    </div>
                    <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginTop: 8 }}>
                      {['GXP Parsed', 'AI Classified'].map(tag => (
                        <span key={tag} style={{
                          fontSize: '0.55rem', background: '#f0fdf4',
                          color: '#16a34a', border: '1px solid #bbf7d0',
                          padding: '2px 7px', borderRadius: 10, fontWeight: 600,
                        }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Risk Assessment */}
                <div style={{
                  background: '#fff7ed', border: '1px solid #fed7aa',
                  borderRadius: 12, padding: 14,
                }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#ea580c', marginBottom: 6 }}>
                    ⚠ Automated Risk Assessment
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#7c2d12', lineHeight: 1.5, marginBottom: 8 }}>
                    <strong>Severity: Critical (Class I Defect/Hazard)</strong><br />
                    Active chemical contamination identified due to potential cross-contamination or visual particulates. Mandatory QP root-cause investigation within 24 hours.
                  </div>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {['CAPA Required', 'Sample Review', 'Field Alert Report'].map(tag => (
                      <span key={tag} style={{
                        fontSize: '0.55rem', background: '#fef2f2',
                        color: '#dc2626', border: '1px solid #fecaca',
                        padding: '2px 7px', borderRadius: 10, fontWeight: 600,
                      }}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right — Form */}
              <div style={{ flex: 1, padding: 20, overflowY: 'auto' }}>
                {/* Section 1 */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{
                    fontSize: '0.6rem', fontWeight: 700, color: '#6366f1',
                    textTransform: 'uppercase', letterSpacing: 1,
                    borderBottom: '1px solid #e0e7ff', paddingBottom: 6, marginBottom: 12,
                  }}>
                    I. Origin & Customer Details
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {[
                      ['Complaint Source', 'Customer Service Email'],
                      ['Customer / Dispatcher Name', 'Sun Pharma Distribution (Dr. S. Patel)'],
                      ['Customer Facility / Account', 'St. Jude Regional Hospital Oncology Pharmacy'],
                      ['Date Received (Regulatory Timestamp)', '28-Jun-2026 14:22:04 UTC'],
                    ].map(([label, value], i) => (
                      <div key={i}>
                        <div style={{ fontSize: '0.6rem', color: '#94a3b8', marginBottom: 3 }}>{label}</div>
                        <div style={{
                          fontSize: '0.72rem', color: '#0f172a', fontWeight: 500,
                          background: '#f8fafc', border: '1px solid #e2e8f0',
                          borderRadius: 6, padding: '6px 8px',
                        }}>{value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 2 */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{
                    fontSize: '0.6rem', fontWeight: 700, color: '#6366f1',
                    textTransform: 'uppercase', letterSpacing: 1,
                    borderBottom: '1px solid #e0e7ff', paddingBottom: 6, marginBottom: 12,
                  }}>
                    II. Product & Batch Identification
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {[
                      ['Product Finished Name', 'Metformin Hydrochloride Tablets'],
                      ['Strength / Dosage Grade', '500 mg (Film-coated)'],
                      ['Batch / Lot Number', 'B0904-1552 ✓ Genealogized'],
                      ['Quantity Affected', '1,200 blisters / 17,000 units'],
                      ['Manufacturing Date', '14-Jan-2025'],
                      ['Expiration Date', '31-Dec-2027'],
                    ].map(([label, value], i) => (
                      <div key={i}>
                        <div style={{ fontSize: '0.6rem', color: '#94a3b8', marginBottom: 3 }}>{label}</div>
                        <div style={{
                          fontSize: '0.72rem', color: '#0f172a', fontWeight: 500,
                          background: '#f8fafc', border: '1px solid #e2e8f0',
                          borderRadius: 6, padding: '6px 8px',
                        }}>{value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 3 */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{
                    fontSize: '0.6rem', fontWeight: 700, color: '#6366f1',
                    textTransform: 'uppercase', letterSpacing: 1,
                    borderBottom: '1px solid #e0e7ff', paddingBottom: 6, marginBottom: 12,
                  }}>
                    III. Defect Classification & Synopsis
                  </div>
                  <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
                    {['Physical Defect: Severe Discolouration', 'Coating Degradation', 'ICH Q8 Risk Matrix: Level 4'].map(tag => (
                      <span key={tag} style={{
                        fontSize: '0.6rem', background: '#fef2f2',
                        color: '#dc2626', border: '1px solid #fecaca',
                        padding: '3px 8px', borderRadius: 10, fontWeight: 600,
                      }}>{tag}</span>
                    ))}
                  </div>
                  <div style={{
                    fontSize: '0.7rem', color: '#374151', background: '#f8fafc',
                    border: '1px solid #e2e8f0', borderRadius: 8,
                    padding: '10px 12px', lineHeight: 1.6,
                  }}>
                    Hospital pharmacy identified mottled dark yellow-to-brownish spots across multiple sealed blister packs of Metformin 500mg. Suspected blister foil pinhole seal breach or moisture uptake during storage.
                  </div>
                </div>

                {/* Save buttons */}
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <div style={{ fontSize: '0.6rem', color: '#94a3b8', alignSelf: 'center' }}>
                    ✓ E-Signature · ALCOA+ Ready
                  </div>
                  <button style={{
                    background: '#fff', border: '1px solid #d1d5db',
                    borderRadius: 8, padding: '7px 14px',
                    fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', color: '#374151',
                  }}>Save Draft</button>
                  <button
                    onClick={() => navigate('/register')}
                    style={{
                      background: '#6366f1', color: '#fff', border: 'none',
                      borderRadius: 8, padding: '7px 16px',
                      fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer',
                    }}>
                    ✓ Commit to QMS Core
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT ACCELERATES ───────────────────────────────── */}
      <section style={{ padding: '64px 5%', background: '#fff', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: '0.65rem', color: '#6366f1', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
              Architected for Regulated Life Sciences
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>
              How AIVOA Accelerates GxP Complaints
            </h2>
            <p style={{ fontSize: '0.82rem', color: '#64748b', maxWidth: 480, margin: '0 auto' }}>
              From chaotic external correspondence to an audit-ready 21 CFR 211.198 complaint file in three autonomous yet fully human-governed stages.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <StageCard
              number="01"
              icon="📥"
              title="Unstructured Ingestion"
              description="Accept complaints from any channel: physician notices, distributor emails, hospital safety portals, or scanned paper batch sheets. Multi-format OCR parses handwritten batch IDs and laboratory photos without manual data extractor overhead."
              metric="Zero Manual Form Re-Typing"
            />
            <StageCard
              number="02"
              icon="✦"
              title="Multi-Agent Entity Extraction"
              description="LangGraph coordinates specialized sub-agents running Groq LLMs. One agent resolves Drug Master File formulations, another queries ERP for batch genealogy, and a clinical agent maps reported side effects against MedDRA and WHO Adverse Event dictionaries."
              metric="< 1.2s Round-Trip Entity Mapping"
            />
            <StageCard
              number="03"
              icon="🛡"
              title="Automated Triage & CAPA"
              description="Complaints are scored on standard risk matrices (Critical, Major, Minor). If a critical batch recall threshold is crossed, automated quarantine triggers notify the Quality Assurance Director and flag the complaint for closure with full 21 CFR Part 11 electronic signatures."
              metric="75% 24-Hour Alert Compliance"
            />
          </div>
        </div>
      </section>

      {/* ── COMPLIANCE ──────────────────────────────────────── */}
      <section style={{ padding: '64px 5%', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: '0.65rem', color: '#6366f1', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
              GxP & Computer Software Assurance (CSA)
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', maxWidth: 500 }}>
              Built for FDA 21 CFR Part 211.198, Part 11, and ALCOA+ Audits
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 8, maxWidth: 480 }}>
              AIVOA does not treat compliance as an afterthought. Every AI classification is strictly deterministic, non-hallucinatory, fully traceable, and exportable for regulatory inspections.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <ComplianceBadge
              title="21 CFR Part 211.198"
              subtitle="Mandatory written complaint files, QA review records, adverse experience handling, automatic 15-day alert escalation."
              tag="FDA Mandate Ready →"
            />
            <ComplianceBadge
              title="21 CFR Part 11 & Annex 11"
              subtitle="Cryptographic electronic signatures, timestamped append-only audit trail logs, strict role-based access control (RBAC) and session timeouts ensuring full compliance."
              tag="E-Sign Certified →"
            />
            <ComplianceBadge
              title="ALCOA+ Data Integrity"
              subtitle="Attributable, Legible, Contemporaneous, Original, and Accurate data records. Every AI action: user input, model decision, and operation shift is permanently frozen."
              tag="Zero Data Loss →"
            />
            <ComplianceBadge
              title="Isolated Private VPC"
              subtitle="Zero public multi-tenant data bleed. Built and hosted on AWS GovCloud, Azure for Healthcare, or air-gapped on-premise infrastructure with zero training on PHI/PII data."
              tag="SOC2 Type II / HIPAA →"
            />
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section style={{
        padding: '64px 5%',
        background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #818cf8 100%)',
        textAlign: 'center',
      }}>
        <h2 style={{
          fontSize: '1.8rem', fontWeight: 800, color: '#fff',
          marginBottom: 12, letterSpacing: '-0.5px',
        }}>
          Modernize Your Pharma QA Complaint Operations Today.
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#c7d2fe', maxWidth: 480,
          margin: '0 auto 32px', lineHeight: 1.7 }}>
          Eliminate triage backlogs and eliminate regulatory non-compliance risks before your next FDA or EMA inspection. Request our complete GAMP 5 validation test pack.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/register')}
            style={{
              background: '#fff', color: '#4f46e5', border: 'none',
              borderRadius: 10, padding: '12px 24px',
              fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer',
            }}>
            Launch QA Workspace
          </button>
          <button
            onClick={() => navigate('/login')}
            style={{
              background: 'transparent', color: '#fff',
              border: '1.5px solid rgba(255,255,255,0.4)',
              borderRadius: 10, padding: '12px 24px',
              fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
            }}>
            Request GAMP5 Pack
          </button>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer style={{
        background: '#0f172a', padding: '20px 5%',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
      }}>
        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
          © 2026 AIVOA Bio-Pharma Systems Inc. Strictly validated for regulated operations.
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          {['Audit Trail Policy', 'Validation Package', 'Staff Training'].map(link => (
            <span key={link} style={{ fontSize: '0.68rem', color: '#94a3b8', cursor: 'pointer' }}>
              {link}
            </span>
          ))}
        </div>
      </footer>
    </div>
  );
}
