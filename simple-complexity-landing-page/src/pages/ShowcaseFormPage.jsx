import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Fade,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Checkbox,
  Paper,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";

/**
 * ShowcaseFormPage.jsx
 * A single-page, complex demo form to highlight your SDK features...
 */

const COUNTRIES = [
  "United States",
  "Canada",
  "Mexico",
  "United Kingdom",
  "Germany",
  "France",
  "Spain",
  "Italy",
  "Brazil",
  "Japan",
  "China",
  "India",
];

const NAICS_SUGGESTIONS = [
  { code: "722513", label: "Limited-Service Restaurants" },
  {
    code: "445110",
    label: "Supermarkets and Other Grocery (ex. convenience) Stores",
  },
  { code: "454110", label: "Electronic Shopping and Mail-Order Houses" },
  { code: "541511", label: "Custom Computer Programming Services" },
  { code: "621210", label: "Offices of Dentists" },
  { code: "812112", label: "Beauty Salons" },
];

const TAX_CLASSES_501C = ["501(c)(3)", "501(c)(4)", "501(c)(6)"];

const PROTECTIVE_DEVICES = [
  { key: "deadbolt", label: "Deadbolt Locks" },
  { key: "burglar_alarm", label: "Local Burglar Alarm" },
  { key: "central_alarm", label: "Central Station Monitored Alarm" },
  { key: "fire_alarm", label: "Smoke/Fire Alarm" },
  { key: "sprinklers", label: "Automatic Sprinkler System" },
];

// --- Spotlight overlay over bottom-right Speed Dial ---
const SPEED_DIAL_OFFSET = 24; // px from bottom/right (typical FAB spacing)
const SPEED_DIAL_DIAMETER = 56; // default MUI FAB is 56px
const SPOTLIGHT_PADDING = 18; // extra space around the FAB

const HOLE_RADIUS = SPEED_DIAL_DIAMETER / 2 + SPOTLIGHT_PADDING;
const HOLE_CENTER_X = `calc(100% - ${
  SPEED_DIAL_OFFSET + SPEED_DIAL_DIAMETER / 2
}px)`;
const HOLE_CENTER_Y = `calc(100% - ${
  SPEED_DIAL_OFFSET + SPEED_DIAL_DIAMETER / 2
}px)`;

export default function ShowcaseFormPage() {
  const [loaded, setLoaded] = useState(false);
  const [showSpotlight, setShowSpotlight] = useState(true);

  // Form state
  const [form, setForm] = useState({
    // Business Info
    legalName: "",
    website: "",
    businessType: "sole",
    country: "United States",
    ein: "",
    vatNumber: "",
    taxClass: "",
    naics: null,
    subsidiaries: [], // Changed from hasSubsidiaries
    // Contact & Terms
    acceptTerms: false,
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    // Complex Questions State - REVISED
    sourceOfWealth: "",
    pepStatus: "not_pep", // Changed from isPEP
    hazardousHobbiesDetails: "", // Changed from hasHazardousHobbies
    propertyProtectiveDevices: {},
    preexistingConditionsDetails: "", // Changed from hasPreexistingConditions
    hipaaConsent: false,
    fatcaStatus: "us_person", // Changed from isExemptFromFatca
  });

  // Logic for conditional fields
  const showEIN = useMemo(
    () => ["llc", "corp"].includes(form.businessType),
    [form.businessType]
  );
  const show501c = useMemo(
    () => form.businessType === "nonprofit",
    [form.businessType]
  );
  const isInternational = useMemo(
    () => form.country !== "United States",
    [form.country]
  );

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 150);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowSpotlight(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Tell SDK about current route + context for recordings
    try {
      window.SC?.context?.set?.({
        route: "/showcase/form",
        title: "Complex Form Showcase",
        meta: { businessType: form.businessType, country: form.country },
      });
    } catch {}
  }, [form.businessType, form.country]);

  const update = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target?.value ?? e }));

  const updateCheckboxGroup = (key, field) => (e) => {
    setForm((f) => ({
      ...f,
      [key]: {
        ...f[key],
        [field]: e.target.checked,
      },
    }));
  };

  const addSubsidiary = () =>
    setForm((f) => ({
      ...f,
      subsidiaries: [...f.subsidiaries, { name: "", country: "United States" }],
    }));

  const updateSubsidiary = (idx, key, value) =>
    setForm((f) => {
      const next = [...f.subsidiaries];
      next[idx] = { ...next[idx], [key]: value };
      return { ...f, subsidiaries: next };
    });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Submitted! (This is a demo page; hook into your real handler)");
  };

  return (
    <>
      <title>SDK Showcase | Simple Complexity</title>
      <meta
        name="description"
        content="See a live demo of the SimpleForm SDK. This showcase demonstrates AI support assistance, customer video recording, and full-page language translation."
      />
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          py: 6,
          px: 3,
          backgroundColor: "#f9f9f9",
        }}
      >
        <Container maxWidth="md">
          <Fade in={loaded} timeout={800}>
            <Paper elevation={3} sx={{ p: 4 }}>
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: "flex", flexDirection: "column", gap: 3 }}
              >
                {/* Header */}
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
                    Showcase Form
                  </Typography>
                  <Typography sx={{ opacity: 0.9 }}>
                    This page demonstrates SimpleForm SDK created for businsess
                    to enhance User Experience, AI Support Assitance, Customer
                    SUppoert Video Recording, Full Page Language Translation,
                    and more. You can access these features in the speedial in
                    the right corner of the screen.
                  </Typography>
                </Box>

                {/* Legal + Website */}
                <TextField
                  fullWidth
                  label="Legal Business Name"
                  value={form.legalName}
                  onChange={update("legalName")}
                  required
                  inputProps={{ "data-sc-intent": "legal_business_name" }}
                />
                <TextField
                  fullWidth
                  label="Website URL"
                  value={form.website}
                  onChange={update("website")}
                  placeholder="https://example.com"
                  inputProps={{ "data-sc-intent": "website_url" }}
                />

                {/* Country + Biz Type */}
                <Autocomplete
                  options={COUNTRIES}
                  value={form.country}
                  onChange={(_, v) =>
                    setForm((f) => ({ ...f, country: v || "" }))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Country of Registration"
                      inputProps={{
                        ...params.inputProps,
                        "data-sc-intent": "country_of_registration",
                      }}
                    />
                  )}
                />
                <FormControl fullWidth>
                  <InputLabel id="biz-type">Business Type</InputLabel>
                  <Select
                    labelId="biz-type"
                    label="Business Type"
                    value={form.businessType}
                    onChange={update("businessType")}
                    data-sc-intent="business_type"
                  >
                    <MenuItem value="sole">Sole Proprietorship</MenuItem>
                    <MenuItem value="llc">LLC</MenuItem>
                    <MenuItem value="corp">Corporation</MenuItem>
                    <MenuItem value="nonprofit">Nonprofit</MenuItem>
                  </Select>
                </FormControl>

                {/* Conditional EIN / VAT / 501(c) */}
                {showEIN && (
                  <TextField
                    fullWidth
                    label="Employer Identification Number (EIN)"
                    placeholder="12-3456789"
                    value={form.ein}
                    onChange={update("ein")}
                    inputProps={{ "data-sc-intent": "ein", maxLength: 10 }}
                  />
                )}
                {isInternational && (
                  <TextField
                    fullWidth
                    label="VAT / Tax ID"
                    placeholder="e.g., GB123456789"
                    value={form.vatNumber}
                    onChange={update("vatNumber")}
                    inputProps={{ "data-sc-intent": "vat_tax_id" }}
                  />
                )}
                {show501c && (
                  <FormControl fullWidth>
                    <InputLabel id="np-tax">Nonprofit Tax Class</InputLabel>
                    <Select
                      labelId="np-tax"
                      label="Nonprofit Tax Class"
                      value={form.taxClass}
                      onChange={update("taxClass")}
                      data-sc-intent="nonprofit_tax_class"
                    >
                      {TAX_CLASSES_501C.map((t) => (
                        <MenuItem key={t} value={t}>
                          {t}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}

                <Autocomplete
                  options={NAICS_SUGGESTIONS}
                  getOptionLabel={(o) => `${o.code} — ${o.label}`}
                  value={form.naics}
                  onChange={(_, v) => setForm((f) => ({ ...f, naics: v }))}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Primary NAICS Code"
                      inputProps={{
                        ...params.inputProps,
                        "data-sc-intent": "naics_code",
                      }}
                    />
                  )}
                />

                {/* Subsidiaries */}
                <Box
                  sx={{
                    p: 2,
                    border: "1px dashed rgba(0,0,0,0.2)",
                    borderRadius: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <Typography variant="subtitle1">
                    Subsidiaries (if any)
                  </Typography>
                  {form.subsidiaries.map((s, i) => (
                    <Box
                      key={i}
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        gap: 2,
                      }}
                    >
                      <TextField
                        fullWidth
                        sx={{ flex: 7 }}
                        label={`Subsidiary #${i + 1} Legal Name`}
                        value={s.name}
                        onChange={(e) =>
                          updateSubsidiary(i, "name", e.target.value)
                        }
                        inputProps={{
                          "data-sc-intent": "subsidiary_legal_name",
                        }}
                      />
                      <Autocomplete
                        sx={{ flex: 5 }}
                        options={COUNTRIES}
                        value={s.country}
                        onChange={(_, v) =>
                          updateSubsidiary(i, "country", v || "")
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Country"
                            inputProps={{
                              ...params.inputProps,
                              "data-sc-intent": "subsidiary_country",
                            }}
                          />
                        )}
                      />
                    </Box>
                  ))}
                  <Button
                    variant="text"
                    onClick={addSubsidiary}
                    sx={{ alignSelf: "flex-start" }}
                  >
                    + Add Subsidiary
                  </Button>
                </Box>

                <Divider sx={{ my: 1, borderColor: "rgba(0,0,0,0.12)" }}>
                  <Chip label="Compliance & Risk" />
                </Divider>

                {/* --- REVISED COMPLEX QUESTIONS --- */}

                <FormControl fullWidth>
                  <InputLabel id="source-wealth-label">
                    Primary Source of Wealth
                  </InputLabel>
                  <Select
                    labelId="source-wealth-label"
                    label="Primary Source of Wealth"
                    value={form.sourceOfWealth}
                    onChange={update("sourceOfWealth")}
                    data-sc-intent="source_of_wealth"
                  >
                    <MenuItem value="employment">Employment Income</MenuItem>
                    <MenuItem value="investments">Investment Profits</MenuItem>
                    <MenuItem value="inheritance">Inheritance</MenuItem>
                    <MenuItem value="business">Business Ownership</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel id="pep-status-label">
                    Politically Exposed Person (PEP) Status
                  </InputLabel>
                  <Select
                    labelId="pep-status-label"
                    label="Politically Exposed Person (PEP) Status"
                    value={form.pepStatus}
                    onChange={update("pepStatus")}
                    data-sc-intent="pep_status"
                  >
                    <MenuItem value="not_pep">
                      I am not a PEP, nor related to one
                    </MenuItem>
                    <MenuItem value="is_pep">I am a PEP</MenuItem>
                    <MenuItem value="family_pep">
                      I am an immediate family member of a PEP
                    </MenuItem>
                    <MenuItem value="associate_pep">
                      I am a known close associate of a PEP
                    </MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Hazardous Activities or Hobbies (leave blank if none)"
                  helperText="e.g., aviation, scuba diving, motorsports, mountaineering"
                  value={form.hazardousHobbiesDetails}
                  onChange={update("hazardousHobbiesDetails")}
                  inputProps={{
                    "data-sc-intent": "hazardous_avocations_details",
                  }}
                />

                <FormControl component="fieldset" fullWidth>
                  <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                    Which protective devices are installed at your primary
                    property?
                  </Typography>
                  <FormGroup row data-sc-intent="property_protective_devices">
                    {PROTECTIVE_DEVICES.map((device) => (
                      <FormControlLabel
                        key={device.key}
                        control={
                          <Checkbox
                            checked={
                              !!form.propertyProtectiveDevices[device.key]
                            }
                            onChange={updateCheckboxGroup(
                              "propertyProtectiveDevices",
                              device.key
                            )}
                          />
                        }
                        label={device.label}
                      />
                    ))}
                  </FormGroup>
                </FormControl>

                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Pre-existing Medical Conditions (leave blank if none)"
                  value={form.preexistingConditionsDetails}
                  onChange={update("preexistingConditionsDetails")}
                  inputProps={{
                    "data-sc-intent": "preexisting_conditions_details",
                  }}
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={form.hipaaConsent}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          hipaaConsent: e.target.checked,
                        }))
                      }
                    />
                  }
                  label="I consent to the use and disclosure of my Protected Health Information (PHI) for treatment, payment, and healthcare operations as described in the HIPAA Notice of Privacy Practices."
                  data-sc-intent="hipaa_phi_consent"
                />

                <FormControl fullWidth>
                  <InputLabel id="filing-status-label">
                    Anticipated Tax Filing Status
                  </InputLabel>
                  <Select
                    labelId="filing-status-label"
                    label="Anticipated Tax Filing Status"
                    value={form.filingStatus}
                    onChange={update("filingStatus")}
                    data-sc-intent="tax_filing_status"
                  >
                    <MenuItem value="single">Single</MenuItem>
                    <MenuItem value="mfj">Married Filing Jointly</MenuItem>
                    <MenuItem value="mfs">Married Filing Separately</MenuItem>
                    <MenuItem value="hoh">Head of Household</MenuItem>
                    <MenuItem value="qw">Qualifying Widow(er)</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel id="fatca-status-label">
                    FATCA Reporting Status
                  </InputLabel>
                  <Select
                    labelId="fatca-status-label"
                    label="FATCA Reporting Status"
                    value={form.fatcaStatus}
                    onChange={update("fatcaStatus")}
                    data-sc-intent="fatca_status"
                  >
                    <MenuItem value="us_person">
                      U.S. Person (Not Exempt)
                    </MenuItem>
                    <MenuItem value="exempt_payee">Exempt Payee</MenuItem>
                    <MenuItem value="foreign_exempt">
                      Foreign Exempt Beneficiary
                    </MenuItem>
                    <MenuItem value="foreign_entity">Foreign Entity</MenuItem>
                  </Select>
                </FormControl>

                <Divider sx={{ my: 1, borderColor: "rgba(0,0,0,0.12)" }}>
                  <Chip label="Primary Contact" />
                </Divider>

                {/* Contact + consents */}
                <TextField
                  fullWidth
                  label="Primary Contact Full Name"
                  value={form.contactName}
                  onChange={update("contactName")}
                  required
                  inputProps={{ "data-sc-intent": "primary_contact_full_name" }}
                />
                <TextField
                  fullWidth
                  label="Contact Email"
                  type="email"
                  value={form.contactEmail}
                  onChange={update("contactEmail")}
                  required
                  inputProps={{ "data-sc-intent": "contact_email" }}
                />
                <TextField
                  fullWidth
                  label="Contact Phone"
                  value={form.contactPhone}
                  onChange={update("contactPhone")}
                  inputProps={{ "data-sc-intent": "contact_phone" }}
                />

                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={!!form.acceptTerms}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            acceptTerms: e.target.checked,
                          }))
                        }
                      />
                    }
                    label="I agree to the Terms of Service and attest that provided information is accurate."
                  />
                </FormGroup>

                {/* Definition demo text */}
                <Box
                  sx={{ p: 2, background: "rgba(0,0,0,0.04)", borderRadius: 2 }}
                  data-sc-define="true"
                >
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    On-demand definitions (highlight any term below):
                  </Typography>
                  <Typography sx={{ opacity: 0.9 }}>
                    Customers may be subject to{" "}
                    <em data-sc-intent="kba">
                      Knowledge-Based Authentication (KBA)
                    </em>{" "}
                    or additional <em data-sc-intent="kyc">KYC</em> checks
                    depending on risk tier and{" "}
                    <em data-sc-intent="pci">PCI DSS</em> scope. All information
                    is subject to <em data-sc-intent="aml">AML</em> regulations
                    and <em data-sc-intent="gdpr">GDPR</em> privacy laws.
                  </Typography>
                </Box>

                {/* Actions */}
                <Box
                  sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}
                >
                  <Button type="submit" variant="contained">
                    Submit Application
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Fade>
        </Container>

        {/* Dark overlay with a transparent "hole" where the bottom-right Speed Dial/FAB sits */}
        {showSpotlight && (
          <Box
            role="presentation"
            aria-hidden
            sx={{
              position: "fixed",
              inset: 0,
              zIndex: (theme) => theme.zIndex.modal + 2,
              pointerEvents: "none", // allow interaction with the Speed Dial
              background: `radial-gradient(
              circle at ${HOLE_CENTER_X} ${HOLE_CENTER_Y},
              rgba(0,0,0,0) 0,
              rgba(0,0,0,0) ${HOLE_RADIUS}px,
              rgba(0,0,0,0.65) ${HOLE_RADIUS + 1}px,
              rgba(0,0,0,0.65) 100%
            )`,
            }}
          />
        )}
      </Box>
    </>
  );
}
