"use client"

import { useEffect, useMemo, useState, type ReactNode } from "react"
import { Link } from "@inertiajs/react"
import { Header } from "@/Components/Header"
import { Footer } from "@/Components/Footer"
import type { BookingPerson, Branch, LocationBranch, PetType, Service, ServiceItem, TimeSlot } from "@/types/booking"

let BRANCHES: Branch[] = []
let CITIES: Branch["city"][] = []
let DOCTORS: BookingPerson[] = []
let GROOMERS: BookingPerson[] = []
let PET_TYPES: PetType[] = []
let SERVICES: Service[] = []
let TIME_SLOTS: TimeSlot[] = []
let BRANCHES_LOCATION: LocationBranch[] = []

type PetBooking = {
  id: string
  name: string
  type: string
  notes: string
  mainItemId: string
  additionalItemId: string
}

type BookingDbProps = {
  services?: any[]
  branches?: any[]
  staff?: any[]
  petTypes?: any[]
  timeSlots?: any[]
}

const syncBookingDataFromDb = (props: BookingDbProps) => {
  if (props.branches?.length) {
    BRANCHES = props.branches.map((branch) => ({
      id: String(branch.slug || branch.id),
      name: branch.name,
      city: branch.city_name || branch.city || "Bali",
      address: branch.address || "",
      phone: branch.whatsapp || branch.phone || "",
      services: branch.services || ["grooming", "boarding", "clinic", "delivery"],
    })) as any

    BRANCHES_LOCATION = props.branches.map((branch) => ({
      id: String(branch.slug || branch.id),
      name: branch.name,
      city: String(branch.city_slug || branch.city || "bali").toLowerCase(),
      address: branch.address || "",
      phone: branch.phone || "",
      whatsapp: branch.whatsapp || branch.phone || "",
      email: branch.email || "",
      hours: { weekday: branch.weekday_hours || "08:00 - 21:00", weekend: branch.weekend_hours || "08:00 - 22:00" },
      services: [],
      bookingservices: branch.services || ["grooming", "boarding", "clinic", "delivery"],
      image: branch.image || "/placeholder.jpg",
      coordinates: { lat: branch.lat || undefined, lng: branch.lng || undefined },
      featured: Boolean(branch.featured),
    })) as any

    CITIES = Array.from(new Set(BRANCHES.map((branch) => branch.city))) as any
  }

  if (props.services?.length) {
    SERVICES = props.services.map((service) => ({
      id: String(service.slug || service.id),
      name: service.name,
      category: service.category_slug || service.category || service.slug || "grooming",
      description: service.description || "",
      price: Number(service.price || 0),
      image: service.image || "/placeholder.jpg",
      duration: service.duration || "",
      rating: Number(service.rating || 4.8),
      active: Boolean(service.active ?? service.is_active ?? true),
      url: service.url || undefined,
      requiresAddress: Boolean(service.requires_address),
      requiresPickup: Boolean(service.requires_pickup),
      requiresSchedule: Boolean(service.requires_schedule ?? true),
      availableModes: service.available_modes || undefined,
      branchRequired: Boolean(service.branch_required ?? true),
      requiresPeople: Boolean(service.requires_people),
      item: service.items || undefined,
      scheduleType: service.schedule_type || "single",
    })) as any
  }

  if (props.staff?.length) {
    DOCTORS = props.staff.filter((person) => person.type === "doctor").map((person) => ({
      name: person.name,
      specialty: person.specialty || "",
      specialties: person.specialties || [person.specialty || "General Practitioner"],
      image: person.image || "/placeholder-user.jpg",
      branchId: String(person.branch_slug || person.branch_id || ""),
    })) as any

    GROOMERS = props.staff.filter((person) => person.type === "groomer").map((person) => ({
      name: person.name,
      specialty: person.specialty || "Groomer",
      specialties: person.specialties || [person.specialty || "Groomer"],
      image: person.image || "/placeholder-user.jpg",
      branchId: String(person.branch_slug || person.branch_id || ""),
    })) as any
  }

  if (props.petTypes?.length) PET_TYPES = props.petTypes.map((type) => type.name) as any
  if (props.timeSlots?.length) TIME_SLOTS = props.timeSlots.map((slot) => ({ time: String(slot.time).slice(0, 5), available: Boolean(slot.active ?? true) }))
}

const TERMS: Record<string, string[]> = {
  default: [
    "Hewan peliharaan wajib dalam kondisi sehat dan tidak sedang sakit menular.",
    "Disarankan / diwajibkan telah melakukan medical checkup oleh dokter hewan sebelum layanan.",
    "Jam operasional grooming pukul 08:00 - 23:00 WIB.",
    "Hewan yang datang melebihi jam booking terakhir akan otomatis masuk layanan boarding dan grooming dilakukan keesokan hari.",
  ],
  grooming: [
    "Grooming hanya untuk anjing dan kucing.",
    "Hewan peliharaan wajib dalam kondisi sehat dan tidak sedang sakit menular.",
    "Disarankan / diwajibkan telah melakukan medical checkup oleh dokter hewan sebelum layanan.",
    "Jam operasional grooming pukul 08:00 - 23:00 WIB.",
    "Hewan yang datang melebihi jam booking terakhir akan otomatis masuk layanan boarding dan grooming dilakukan keesokan hari.",
  ],
  boarding: [
    "Boarding hanya untuk anjing dan kucing.",
    "Hewan peliharaan wajib dalam kondisi sehat dan tidak sedang sakit menular.",
    "Disarankan / diwajibkan telah melakukan medical checkup oleh dokter hewan sebelum layanan.",
    "Jam operasional boarding pukul 08:00 - 20:00 WIB.",
    "Hewan yang dijemput melebihi jam booking terakhir akan otomatis masuk layanan boarding dan dijemput keesokan hari.",
  ],
  clinic: [
    "Layanan klinik mengikuti jadwal dokter dan cabang yang dipilih.",
    "Pilih layanan klinik sesuai spesialisasi dokter yang tersedia.",
    "Untuk kondisi darurat, hubungi cabang terlebih dahulu sebelum datang.",
  ],
}

const createPet = (index: number): PetBooking => ({
  id: `${Date.now()}-${index}`,
  name: "",
  type: "",
  notes: "",
  mainItemId: "",
  additionalItemId: "",
})

const toWhatsAppNumber = (value?: string) => {
  const digits = String(value || "").replace(/\D/g, "")

  if (!digits) return ""
  if (digits.startsWith("0")) return `62${digits.slice(1)}`
  if (digits.startsWith("62")) return digits

  return digits
}

export default function BookingPage(props: BookingDbProps) {
  syncBookingDataFromDb(props)
  const searchParams = useMemo(() => new URLSearchParams(window.location.search), [])
  const serviceParam = searchParams.get("service") || ""
  const initialService = SERVICES.find(
    (service) => (service.id === serviceParam || service.category === serviceParam) && service.active,
  )

  const [step, setStep] = useState(initialService ? 2 : 1)
  const [selectedService, setSelectedService] = useState(initialService?.id || "")
  const [selectedCity, setSelectedCity] = useState<Branch["city"] | "">("")
  const [selectedBranch, setSelectedBranch] = useState("")
  const [serviceMode, setServiceMode] = useState("")
  const [address, setAddress] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [selectedPeople, setSelectedPeople] = useState("")
  const [pets, setPets] = useState<PetBooking[]>([createPet(1)])
  const [userEmail, setUserEmail] = useState("")
  const [userName, setUserName] = useState("")
  const [userPhone, setUserPhone] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const service = SERVICES.find((item) => item.id === selectedService)
  const branch = BRANCHES.find((item) => item.id === selectedBranch)
  const mapBranch = useMemo(() => BRANCHES_LOCATION.find((item) => item.id === selectedBranch), [selectedBranch])
  const mapQuery = useMemo(() => {
    if (!mapBranch) return ""

    const hasCoordinates =
      typeof mapBranch.coordinates?.lat === "number" && typeof mapBranch.coordinates?.lng === "number"
    if (hasCoordinates) {
      return `${mapBranch.coordinates.lat},${mapBranch.coordinates.lng}`
    }

    return mapBranch.address || ""
  }, [mapBranch])

  const mapUrl = useMemo(() => {
    if (!mapQuery) return ""
    return `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=16&output=embed`
  }, [mapQuery])
  const serviceTerms = TERMS[service?.category ?? "default"] || TERMS.default
  const requiresPeople = Boolean(service?.requiresPeople)
  const visibleSteps = requiresPeople ? [1, 2, 3, 4, 5, 6] : [1, 2, 3, 5, 6]
  const displayStep = Math.max(visibleSteps.indexOf(step) + 1, 1)
  const selectedPerson = getSelectedPerson(service?.category, selectedPeople)
  const stepTitle = getStepTitle(step, service?.category)

  const availableBranches = useMemo(() => {
    if (!service || !selectedCity) return []

    return BRANCHES.filter(
      (item) => item.city === selectedCity && item.services.includes(service.category),
    )
  }, [selectedCity, service])

  const filteredPeople = useMemo(() => {
    if (!service || !selectedBranch) return []

    if (service.category === "grooming") {
      return GROOMERS.filter((person) => person.branchId === selectedBranch)
    }

    if (service.category === "clinic") {
      return DOCTORS.filter((person) => person.branchId === selectedBranch)
    }

    return []
  }, [selectedBranch, service])

  const totalDays = getTotalDays(checkIn, checkOut)
  const totalPrice = pets.reduce((sum, pet) => sum + getPetPrice(pet, service?.item, service?.scheduleType, totalDays), 0)

  useEffect(() => {
    const userSession = localStorage.getItem("petshop-user")

    if (userSession) {
      const user = JSON.parse(userSession)
      setUserEmail(user.email)
      setUserName(user.name)
      setUserPhone(user.phone)
      setIsLoggedIn(true)
    }
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [step])

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId)
    setSelectedCity("")
    setSelectedBranch("")
    setServiceMode("")
    setAddress("")
    setSelectedDate("")
    setSelectedTime("")
    setCheckIn("")
    setCheckOut("")
    setSelectedPeople("")
    setPets([createPet(1)])
  }

  const handleCitySelect = (city: Branch["city"]) => {
    setSelectedCity(city)
    setSelectedBranch("")
    setSelectedPeople("")
  }

  const updatePet = (petId: string, patch: Partial<PetBooking>) => {
    setPets((currentPets) =>
      currentPets.map((pet) => {
        if (pet.id !== petId) return pet

        return {
          ...pet,
          ...patch,
          ...(patch.type ? { mainItemId: "", additionalItemId: "" } : {}),
        }
      }),
    )
  }

  const addPet = () => {
    setPets((currentPets) => [...currentPets, createPet(currentPets.length + 1)])
  }

  const removePet = (petId: string) => {
    setPets((currentPets) => currentPets.filter((pet) => pet.id !== petId))
  }

  const goBack = () => {
    const currentIndex = visibleSteps.indexOf(step)
    setStep(visibleSteps[Math.max(0, currentIndex - 1)] || 1)
  }

  const goNext = () => {
    if (!validateStep()) return

    const currentIndex = visibleSteps.indexOf(step)
    setStep(visibleSteps[currentIndex + 1] || 6)
  }

  const handlePeopleSelect = (name: string) => {
    setSelectedPeople(name)

    if (step === 4 && requiresPeople) {
      const currentIndex = visibleSteps.indexOf(4)
      setStep(visibleSteps[currentIndex + 1] || 6)
    }
  }

  const validateStep = () => {
    if (step === 1 && !selectedService) {
      alert("Pilih layanan terlebih dahulu")
      return false
    }

    if (step === 2) {
      if (!selectedCity) {
        alert("Pilih kota terlebih dahulu")
        return false
      }

      if (service?.branchRequired && !selectedBranch) {
        alert("Pilih cabang terlebih dahulu")
        return false
      }

      if (service?.availableModes && !serviceMode) {
        alert("Pilih tipe layanan terlebih dahulu")
        return false
      }

      if ((service?.requiresAddress || serviceMode === "Home Visit" || serviceMode === "Delivery") && !address.trim()) {
        alert("Isi alamat terlebih dahulu")
        return false
      }
    }

    if (step === 3) {
      if (service?.scheduleType === "single" && (!selectedDate || !selectedTime)) {
        alert("Pilih tanggal dan waktu terlebih dahulu")
        return false
      }

      if (service?.scheduleType === "range" && (!checkIn || !checkOut)) {
        alert("Pilih tanggal check-in dan check-out")
        return false
      }
    }

    if (step === 4 && requiresPeople && !selectedPeople) {
      alert(service?.category === "grooming" ? "Pilih groomer terlebih dahulu" : "Pilih dokter terlebih dahulu")
      return false
    }

    if (step === 5) {
      const hasItems = Boolean(service?.item?.length)
      const invalidPet = pets.find((pet) => !pet.name.trim() || !pet.type || (hasItems && !pet.mainItemId))

      if (invalidPet) {
        alert("Lengkapi nama, jenis, dan layanan utama untuk setiap hewan")
        return false
      }
    }

    return true
  }

  const handleSubmit = () => {
    if (!userEmail || !userName || !userPhone) {
      alert("Mohon isi semua data pemesan")
      return
    }

    if (!validatePetOrders(pets, service?.item)) {
      alert("Lengkapi data hewan dan layanan utama untuk setiap hewan")
      return
    }

    const peopleLabel = service?.category === "grooming" ? "Groomer" : "Dokter"
    const scheduleText =
      service?.scheduleType === "single"
        ? `Jadwal\n- Tanggal: ${selectedDate || "-"}\n- Waktu: ${selectedTime || "-"}`
        : `Jadwal\n- Check-in: ${checkIn || "-"}\n- Check-out: ${checkOut || "-"}`

    const petsText = pets
      .map((pet, index) => {
        const mainItem = findItem(service?.item, pet.mainItemId)
        const additionalItem = findItem(service?.item, pet.additionalItemId)

        return `Hewan ${index + 1}\n- Nama: ${pet.name || "-"}\n- Jenis: ${pet.type || "-"}\n- Catatan: ${pet.notes || "-"}\n- Layanan utama: ${mainItem?.name || "-"}\n- Layanan tambahan: ${additionalItem?.name || "-"}`
      })
      .join("\n\n")

    const addressText =
      service?.requiresAddress || serviceMode === "Home Visit" || serviceMode === "Delivery"
        ? `- Alamat: ${address || "-"}`
        : ""

    const peopleText = requiresPeople ? `${peopleLabel}\n- ${selectedPeople || "-"}` : ""

    const message = `
Halo, saya ingin melakukan booking layanan.

Layanan
- Nama Layanan: ${service?.name || "-"}
- Kota: ${selectedCity || "-"}
- Cabang: ${branch?.name || "-"}
- Tipe Layanan: ${serviceMode || "-"}
${addressText}

${scheduleText}

${peopleText}

Hewan Peliharaan
${petsText}

Customer
- Nama: ${userName || "-"}
- Email: ${userEmail || "-"}
- No. HP: ${userPhone || "-"}

Total Harga
Rp ${totalPrice.toLocaleString("id-ID")}
    `.trim()

    const whatsappNumber = toWhatsAppNumber(branch?.phone)

    if (!whatsappNumber) {
      alert("Nomor WhatsApp cabang belum tersedia")
      return
    }

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank")
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12">
              <h1 className="mb-2 text-4xl font-bold text-primary">Pesan Layanan Kami</h1>
              <p className="text-muted-foreground">
                Langkah {displayStep} dari {visibleSteps.length} - {stepTitle}
              </p>
            </div>

            <div className="mb-12 flex gap-2">
              {visibleSteps.map((item, index) => (
                <div
                  key={item}
                  className={`h-2 flex-1 rounded-full transition-colors ${
                    index <= displayStep - 1 ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>

            <div className="rounded-lg border border-border bg-white p-8">
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-foreground">Pilih Layanan</h2>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {SERVICES.filter((item) => item.active).map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleServiceSelect(item.id)}
                        className={`rounded-lg border-2 p-4 text-left transition-all ${
                          selectedService === item.id ? "border-primary bg-primary/5" : "border-border hover:border-primary"
                        }`}
                      >
                        <h3 className="font-semibold text-foreground">{item.name}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">Pilih Kota & Cabang</h2>
                    {service && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        Layanan dipilih: <span className="font-semibold text-foreground">{service.name}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-3 block text-sm font-semibold">Kota</label>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                      {CITIES.map((city) => (
                        <button
                          key={city}
                          type="button"
                          onClick={() => handleCitySelect(city)}
                          className={`rounded-lg border p-3 font-semibold transition ${
                            selectedCity === city ? "border-primary bg-primary text-white" : "border-border hover:border-primary"
                          }`}
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-3 block text-sm font-semibold">Cabang</label>
                    {!selectedCity ? (
                      <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
                        Pilih kota untuk melihat cabang yang menyediakan layanan ini.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        {availableBranches.length > 0 && (
                          <BranchDropdown
                            branches={availableBranches}
                            value={selectedBranch}
                            onChange={(branchId) => {
                              setSelectedBranch(branchId)
                              setSelectedPeople("")
                            }}
                          />
                        )}

                        {selectedBranch && branch && mapUrl && (
                          <div className="overflow-hidden rounded-lg border border-border md:col-span-2">
                            <iframe
                              title={`Map ${branch.name}`}
                              src={mapUrl}
                              width="100%"
                              height="320"
                              loading="lazy"
                              referrerPolicy="no-referrer-when-downgrade"
                              className="w-full"
                            />
                          </div>
                        )}

                        {availableBranches.length === 0 && (
                          <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
                            Belum ada cabang di kota ini yang menyediakan {service?.name}.
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {service?.availableModes && (
                    <div>
                      <label className="mb-3 block text-sm font-semibold">Tipe Layanan</label>
                      <div className="flex flex-wrap gap-2">
                        {service.availableModes.map((mode) => (
                          <button
                            key={mode}
                            type="button"
                            onClick={() => setServiceMode(mode)}
                            className={`rounded-lg border px-4 py-2 font-semibold transition ${
                              serviceMode === mode ? "border-primary bg-primary text-white" : "border-border hover:border-primary"
                            }`}
                          >
                            {mode}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {(service?.requiresAddress || serviceMode === "Home Visit" || serviceMode === "Delivery") && (
                    <div>
                      <label className="mb-2 block text-sm font-semibold">Alamat</label>
                      <textarea
                        value={address}
                        onChange={(event) => setAddress(event.target.value)}
                        placeholder="Masukkan alamat lengkap..."
                        rows={3}
                        className="w-full rounded-lg border border-input px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-foreground">Pilih Jadwal</h2>

                  {service?.scheduleType === "single" && (
                    <>
                      <div>
                        <label className="mb-3 block text-sm font-semibold">Tanggal</label>
                        <input
                          type="date"
                          value={selectedDate}
                          min={new Date().toISOString().split("T")[0]}
                          onChange={(event) => {
                            setSelectedDate(event.target.value)
                            setSelectedTime("")
                          }}
                          className="w-full rounded-lg border px-4 py-2"
                        />
                      </div>

                      <div>
                        <label className="mb-3 block text-sm font-semibold text-foreground">Waktu</label>
                        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                          {TIME_SLOTS.map((slot) => {
                            const isDisabled = !selectedDate || !slot.available || isPastTime(selectedDate, slot.time)

                            return (
                              <button
                                key={slot.time}
                                type="button"
                                onClick={() => !isDisabled && setSelectedTime(slot.time)}
                                disabled={isDisabled}
                                className={`rounded-lg border p-3 font-semibold transition-all ${
                                  selectedTime === slot.time
                                    ? "border-primary bg-primary text-white"
                                    : !isDisabled
                                      ? "border-border bg-white hover:border-primary"
                                      : "cursor-not-allowed border-border bg-muted text-muted-foreground opacity-60"
                                }`}
                              >
                                {slot.time}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </>
                  )}

                  {service?.scheduleType === "range" && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-semibold">Check-in</label>
                        <input
                          type="date"
                          value={checkIn}
                          min={new Date().toISOString().split("T")[0]}
                          onChange={(event) => {
                            setCheckIn(event.target.value)
                            setCheckOut("")
                          }}
                          className="w-full rounded-lg border px-4 py-2"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold">Check-out</label>
                        <input
                          type="date"
                          value={checkOut}
                          min={checkIn}
                          onChange={(event) => setCheckOut(event.target.value)}
                          className="w-full rounded-lg border px-4 py-2"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {step === 4 && (
                <PeopleStep
                  serviceCategory={service?.category}
                  people={filteredPeople}
                  selectedPeople={selectedPeople}
                  onSelect={handlePeopleSelect}
                />
              )}

              {step === 5 && (
                <div className="space-y-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">Data Hewan & Layanan</h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Tambahkan lebih dari satu hewan dalam order yang sama, lalu pilih layanan untuk masing-masing hewan.
                      </p>
                    </div>
                    {/* <button
                      type="button"
                      onClick={addPet}
                      className="rounded-lg border border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/5"
                    >
                      Tambah Hewan
                    </button> */}
                  </div>

                  <div className="space-y-5">
                    {pets.map((pet, index) => (
                      <PetOrderCard
                        key={pet.id}
                        index={index}
                        pet={pet}
                        canRemove={pets.length > 1}
                        items={getFilteredItems(service?.item, pet.type, "", service?.category, selectedPerson)}
                        scheduleType={service?.scheduleType}
                        totalDays={totalDays}
                        onUpdate={(patch) => updatePet(pet.id, patch)}
                        onRemove={() => removePet(pet.id)}
                      />
                    ))}
                    <button
                        type="button"
                        onClick={addPet}
                        className="w-full rounded-xl border-2 border-dashed border-primary px-4 py-3 text-sm font-semibold text-primary transition hover:bg-primary/5"
                      >
                        + Tambah Hewan Lagi
                      </button>
                  </div>
                </div>
              )}

              {step === 6 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-foreground">Konfirmasi Booking</h2>

                  {!isLoggedIn ? (
                    <>
                      <div className="rounded-lg border border-primary/20 bg-blue-50 p-4">
                        <p className="text-sm text-foreground">
                          Belum login?{" "}
                          <Link href="/login?redirect=/booking" className="font-semibold text-primary hover:underline">
                            Login di sini
                          </Link>{" "}
                          atau isi data di bawah.
                        </p>
                      </div>

                      <CustomerFields
                        userName={userName}
                        userEmail={userEmail}
                        userPhone={userPhone}
                        onNameChange={setUserName}
                        onEmailChange={setUserEmail}
                        onPhoneChange={setUserPhone}
                      />
                    </>
                  ) : (
                    <div className="space-y-2 rounded-lg border border-green-200 bg-green-50 p-4 text-sm">
                      <p>
                        <span className="font-semibold">Nama:</span> {userName}
                      </p>
                      <p>
                        <span className="font-semibold">Email:</span> {userEmail}
                      </p>
                      <p>
                        <span className="font-semibold">No. Telepon:</span> {userPhone}
                      </p>
                    </div>
                  )}

                  <BookingSummary
                    serviceName={service?.name}
                    city={selectedCity}
                    branchName={branch?.name}
                    serviceMode={serviceMode}
                    address={address}
                    scheduleType={service?.scheduleType}
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                    checkIn={checkIn}
                    checkOut={checkOut}
                    peopleLabel={service?.category === "grooming" ? "Groomer" : "Dokter"}
                    selectedPeople={requiresPeople ? selectedPeople : ""}
                    pets={pets}
                    items={service?.item}
                    totalPrice={totalPrice}
                  />
                </div>
              )}

              {selectedService && (
                <div className="mt-6 rounded-xl border border-yellow-200 bg-yellow-50 p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="text-lg font-bold text-yellow-700">!</span>
                    <h4 className="text-sm font-semibold text-yellow-800">Syarat & Ketentuan</h4>
                  </div>

                  <ul className="space-y-2 text-sm text-yellow-900">
                    {serviceTerms.map((term) => (
                      <li key={term} className="flex items-start gap-2">
                        <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-yellow-500" />
                        <span className="leading-relaxed">{term}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-8 flex gap-3 border-t border-border pt-6">
                <button
                  type="button"
                  onClick={goBack}
                  disabled={displayStep === 1}
                  className="rounded-lg border border-border px-6 py-2 font-semibold text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Kembali
                </button>

                {step < 6 ? (
                  <button
                    type="button"
                    onClick={goNext}
                    className="ml-auto rounded-lg bg-primary px-6 py-2 font-semibold text-white hover:bg-primary/90"
                  >
                    Lanjut
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="ml-auto rounded-lg bg-accent px-6 py-2 font-semibold text-white hover:bg-accent/90"
                  >
                    Konfirmasi Booking
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

function PeopleStep({
  serviceCategory,
  people,
  selectedPeople,
  onSelect,
}: {
  serviceCategory?: string
  people: BookingPerson[]
  selectedPeople: string
  onSelect: (name: string) => void
}) {
  const isGrooming = serviceCategory === "grooming"

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">{isGrooming ? "Pilih Groomer" : "Pilih Dokter Spesialis"}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {isGrooming
            ? "Pilih groomer yang tersedia di cabang ini."
            : "Layanan klinik berikutnya akan disaring berdasarkan spesialisasi dokter yang dipilih."}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
        {people.map((person) => {
          const isSelected = selectedPeople === person.name

          return (
            <button
              key={person.name}
              type="button"
              onClick={() => onSelect(person.name)}
              className={`rounded-lg border p-3 text-left transition ${
                isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary"
              }`}
            >
              <img src={person.image} alt={person.name} className="mb-2 h-28 w-full rounded bg-white object-contain" />
              <p className="text-sm font-semibold leading-tight">{person.name}</p>
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{person.specialty}</p>
            </button>
          )
        })}

        {people.length === 0 && (
          <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
            Belum ada petugas yang tersedia untuk cabang ini.
          </p>
        )}
      </div>
    </div>
  )
}

function PetOrderCard({
  index,
  pet,
  canRemove,
  items,
  scheduleType,
  totalDays,
  onUpdate,
  onRemove,
}: {
  index: number
  pet: PetBooking
  canRemove: boolean
  items: ServiceItem[]
  scheduleType?: "range" | "single"
  totalDays: number
  onUpdate: (patch: Partial<PetBooking>) => void
  onRemove: () => void
}) {
  const mainItems = items.filter((item) => item.type === "main")
  const additionalItems = items.filter((item) => item.type === "additional")
  const petTotal = getPetPrice(pet, items, scheduleType, totalDays)
  const selectedMainItem = findItem(items, pet.mainItemId)
  const selectedAdditionalItem = findItem(items, pet.additionalItemId)

  return (
    <div className="rounded-xl border border-border p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <h3 className="font-semibold text-foreground">Hewan {index + 1}</h3>
        {canRemove && (
          <button type="button" onClick={onRemove} className="text-sm font-semibold text-red-600 hover:underline">
            Hapus
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold">Nama Hewan</label>
          <input
            type="text"
            value={pet.name}
            onChange={(event) => onUpdate({ name: event.target.value })}
            placeholder="Contoh: Buddy"
            className="w-full rounded-lg border border-input px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold">Jenis Hewan</label>
          <select
            value={pet.type}
            onChange={(event) => onUpdate({ type: event.target.value })}
            className="w-full rounded-lg border border-input px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Pilih Jenis Hewan</option>
            {PET_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-2 block text-sm font-semibold">Catatan Hewan</label>
        <textarea
          value={pet.notes}
          onChange={(event) => onUpdate({ notes: event.target.value })}
          placeholder="Contoh: alergi, temperamen, riwayat sakit, atau instruksi khusus..."
          rows={3}
          className="w-full rounded-lg border border-input px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="mt-5 space-y-5">
        <div>
          <ServiceItemDropdown
            label="Layanan Utama"
            items={mainItems}
            value={pet.mainItemId}
            selectedItem={selectedMainItem}
            emptyText="Tidak ada layanan utama yang cocok dengan jenis hewan dan spesialisasi yang dipilih."
            placeholder="Pilih layanan utama"
            onChange={(itemId) => onUpdate({ mainItemId: itemId })}
          />
        </div>

        {additionalItems.length > 0 && (
          <div>
            <ServiceItemDropdown
              label="Layanan Tambahan"
              labelHint="(opsional)"
              items={additionalItems}
              value={pet.additionalItemId}
              selectedItem={selectedAdditionalItem}
              emptyText="Tidak ada layanan tambahan yang cocok."
              placeholder="Pilih layanan tambahan"
              optional
              onChange={(itemId) => onUpdate({ additionalItemId: itemId })}
            />
          </div>
        )}
      </div>

      <div className="mt-5 flex justify-between border-t border-border pt-4 text-sm">
        <span className="text-muted-foreground">Subtotal hewan</span>
        <span className="font-semibold text-foreground">Rp {petTotal.toLocaleString("id-ID")}</span>
      </div>
    </div>
  )
}

function BranchDropdown({
  branches,
  value,
  onChange,
}: {
  branches: Branch[]
  value: string
  onChange: (branchId: string) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const selectedBranch = branches.find((branch) => branch.id === value)
  const filteredBranches = branches.filter((branch) => {
    const keyword = query.toLowerCase()

    return branch.name.toLowerCase().includes(keyword) || branch.address.toLowerCase().includes(keyword)
  })

  const handleSelect = (branchId: string) => {
    onChange(branchId)
    setIsOpen(false)
    setQuery("")
  }

  return (
    <div className="relative md:col-span-2">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-3 rounded-lg border border-input bg-background px-4 py-3 text-left text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <span className={selectedBranch ? "text-foreground" : "text-muted-foreground"}>
          {selectedBranch ? selectedBranch.name : "Pilih Cabang"}
        </span>
        <span className="shrink-0 text-muted-foreground">v</span>
      </button>

      {isOpen && (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-lg border border-border bg-white shadow-lg">
          <div className="border-b border-border p-2">
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari nama atau alamat cabang..."
              className="w-full rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
          </div>

          <div className="max-h-64 overflow-y-auto py-1">
            {filteredBranches.map((branch) => (
              <button
                key={branch.id}
                type="button"
                onClick={() => handleSelect(branch.id)}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-muted ${
                  value === branch.id ? "bg-primary/5 text-primary" : "text-foreground"
                }`}
              >
                <span className="block font-medium">{branch.name}</span>
                <span className="line-clamp-2 text-xs text-muted-foreground">{branch.address}</span>
              </button>
            ))}

            {filteredBranches.length === 0 && (
              <p className="px-3 py-4 text-sm text-muted-foreground">Cabang tidak ditemukan.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function ServiceItemDropdown({
  label,
  labelHint,
  items,
  value,
  selectedItem,
  emptyText,
  placeholder,
  optional = false,
  onChange,
}: {
  label: string
  labelHint?: string
  items: ServiceItem[]
  value: string
  selectedItem?: ServiceItem
  emptyText: string
  placeholder: string
  optional?: boolean
  onChange: (itemId: string) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const filteredItems = items.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()))

  const handleSelect = (itemId: string) => {
    onChange(itemId)
    setIsOpen(false)
    setQuery("")
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-semibold">
        {label} {labelHint && <span className="font-normal text-muted-foreground">{labelHint}</span>}
      </label>

      {items.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">{emptyText}</p>
      ) : (
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen((current) => !current)}
            className="flex w-full items-center justify-between gap-3 rounded-lg border border-input bg-background px-4 py-3 text-left text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <span className={selectedItem ? "text-foreground" : "text-muted-foreground"}>
              {selectedItem ? `${selectedItem.name} - Rp ${selectedItem.price.toLocaleString("id-ID")}` : placeholder}
            </span>
            <span className="shrink-0 text-muted-foreground">v</span>
          </button>

          {isOpen && (
            <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-lg border border-border bg-white shadow-lg">
              <div className="border-b border-border p-2">
                <input
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Cari nama layanan..."
                  className="w-full rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                />
              </div>

              <div className="max-h-64 overflow-y-auto py-1">
                {optional && value && (
                  <button
                    type="button"
                    onClick={() => handleSelect("")}
                    className="w-full px-3 py-2 text-left text-sm text-muted-foreground hover:bg-muted"
                  >
                    Hapus pilihan
                  </button>
                )}

                {filteredItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect(item.id)}
                    className={`w-full px-3 py-2 text-left text-sm hover:bg-muted ${
                      value === item.id ? "bg-primary/5 text-primary" : "text-foreground"
                    }`}
                  >
                    <span className="block font-medium">{item.name}</span>
                    <span className="text-xs text-muted-foreground">Rp {item.price.toLocaleString("id-ID")}</span>
                  </button>
                ))}

                {filteredItems.length === 0 && (
                  <p className="px-3 py-4 text-sm text-muted-foreground">Layanan tidak ditemukan.</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function CustomerFields({
  userName,
  userEmail,
  userPhone,
  onNameChange,
  onEmailChange,
  onPhoneChange,
}: {
  userName: string
  userEmail: string
  userPhone: string
  onNameChange: (value: string) => void
  onEmailChange: (value: string) => void
  onPhoneChange: (value: string) => void
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="mb-3 block text-sm font-semibold text-foreground">Nama Lengkap</label>
        <input
          type="text"
          value={userName}
          onChange={(event) => onNameChange(event.target.value)}
          placeholder="Nama Lengkap Anda"
          className="w-full rounded-lg border border-input px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="mb-3 block text-sm font-semibold text-foreground">Email</label>
        <input
          type="email"
          value={userEmail}
          onChange={(event) => onEmailChange(event.target.value)}
          placeholder="Email Anda"
          className="w-full rounded-lg border border-input px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="mb-3 block text-sm font-semibold text-foreground">No. Telepon</label>
        <input
          type="tel"
          value={userPhone}
          onChange={(event) => onPhoneChange(event.target.value)}
          placeholder="No. Telepon Anda"
          className="w-full rounded-lg border border-input px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
    </div>
  )
}

function BookingSummary({
  serviceName,
  city,
  branchName,
  serviceMode,
  address,
  scheduleType,
  selectedDate,
  selectedTime,
  checkIn,
  checkOut,
  peopleLabel,
  selectedPeople,
  pets,
  items,
  totalPrice,
}: {
  serviceName?: string
  city: string
  branchName?: string
  serviceMode: string
  address: string
  scheduleType?: "range" | "single"
  selectedDate: string
  selectedTime: string
  checkIn: string
  checkOut: string
  peopleLabel: string
  selectedPeople: string
  pets: PetBooking[]
  items?: ServiceItem[]
  totalPrice: number
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="bg-blue-50 px-5 py-4">
        <p className="mb-1 text-xs font-medium uppercase tracking-widest text-blue-600">Ringkasan Booking</p>
        <p className="text-lg font-semibold text-foreground">{serviceName}</p>
      </div>

      <div className="space-y-4 px-5 py-4 text-sm">
        <SummarySection title="Layanan">
          <SummaryRow label="Kota" value={city || "-"} />
          <SummaryRow label="Cabang" value={branchName || "-"} />
          <SummaryRow label="Tipe layanan" value={serviceMode || "-"} />
          {address && <SummaryRow label="Alamat" value={address} />}
        </SummarySection>

        <SummarySection title="Jadwal">
          {scheduleType === "single" ? (
            <>
              <SummaryRow label="Tanggal" value={selectedDate || "-"} />
              <SummaryRow label="Waktu" value={selectedTime || "-"} />
            </>
          ) : (
            <>
              <SummaryRow label="Check-in" value={checkIn || "-"} />
              <SummaryRow label="Check-out" value={checkOut || "-"} />
            </>
          )}
        </SummarySection>

        {selectedPeople && (
          <SummarySection title={peopleLabel}>
            <SummaryRow label={peopleLabel} value={selectedPeople} />
          </SummarySection>
        )}

        <SummarySection title="Hewan Peliharaan">
          <div className="space-y-3">
            {pets.map((pet, index) => {
              const mainItem = findItem(items, pet.mainItemId)
              const additionalItem = findItem(items, pet.additionalItemId)

              return (
                <div key={pet.id} className="rounded-lg bg-muted/40 p-3">
                  <p className="font-semibold text-foreground">Hewan {index + 1}</p>
                  <div className="mt-2 space-y-1">
                    <SummaryRow label="Nama" value={pet.name || "-"} />
                    <SummaryRow label="Jenis" value={pet.type || "-"} />
                    <SummaryRow label="Catatan" value={pet.notes || "-"} />
                    <SummaryRow label="Layanan utama" value={mainItem?.name || "-"} />
                    <SummaryRow label="Layanan tambahan" value={additionalItem?.name || "-"} />
                  </div>
                </div>
              )
            })}
          </div>
        </SummarySection>
      </div>

      <div className="flex items-center justify-between border-t border-border bg-muted/40 px-5 py-4">
        <span className="text-sm text-muted-foreground">Total harga</span>
        <span className="text-xl font-semibold text-foreground">Rp {totalPrice.toLocaleString("id-ID")}</span>
      </div>
    </div>
  )
}

function SummarySection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-b border-border pb-4 last:border-b-0 last:pb-0">
      <p className="mb-2 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="shrink-0 text-muted-foreground">{label}</span>
      <span className="text-right font-medium text-foreground">{value}</span>
    </div>
  )
}

function getStepTitle(step: number, category?: string) {
  if (step === 1) return "Pilih Layanan"
  if (step === 2) return "Pilih Kota & Cabang"
  if (step === 3) return "Pilih Jadwal"
  if (step === 4) return category === "grooming" ? "Pilih Groomer" : "Pilih Dokter Spesialis"
  if (step === 5) return "Data Hewan & Layanan"
  return "Konfirmasi & Data Pemesan"
}

function getSelectedPerson(category: string | undefined, selectedPeople: string) {
  if (category === "grooming") return GROOMERS.find((person) => person.name === selectedPeople)
  if (category === "clinic") return DOCTORS.find((person) => person.name === selectedPeople)
  return undefined
}

function getFilteredItems(
  items: ServiceItem[] | undefined,
  petType: string,
  searchQuery: string,
  category: string | undefined,
  selectedPerson: BookingPerson | undefined,
) {
  return (
    items?.filter((item) => {
      const matchPet = !item.petType || !petType || item.petType.includes(petType as PetType)
      const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchSpecialty =
        category !== "clinic" ||
        !selectedPerson ||
        !item.specialties ||
        item.specialties.some((specialty) => selectedPerson.specialties.includes(specialty))

      return matchPet && matchSearch && matchSpecialty
    }) || []
  )
}

function getPetPrice(
  pet: PetBooking,
  items: ServiceItem[] | undefined,
  scheduleType: "range" | "single" | undefined,
  totalDays: number,
) {
  const itemTotal = (findItem(items, pet.mainItemId)?.price || 0) + (findItem(items, pet.additionalItemId)?.price || 0)
  const multiplier = scheduleType === "range" ? Math.max(totalDays + 1, 1) : 1

  return itemTotal * multiplier
}

function getTotalDays(checkIn: string, checkOut: string) {
  if (!checkIn || !checkOut) return 0

  const start = new Date(checkIn)
  const end = new Date(checkOut)
  const diffTime = end.getTime() - start.getTime()

  return Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 0)
}

function findItem(items: ServiceItem[] | undefined, itemId: string) {
  return items?.find((item) => item.id === itemId)
}

function validatePetOrders(pets: PetBooking[], items: ServiceItem[] | undefined) {
  const hasItems = Boolean(items?.length)

  return pets.every((pet) => pet.name.trim() && pet.type && (!hasItems || pet.mainItemId))
}

function isPastTime(selectedDate: string, slotTime: string) {
  if (!selectedDate) return false

  const now = new Date()
  const selected = new Date(selectedDate)

  if (
    selected.getFullYear() !== now.getFullYear() ||
    selected.getMonth() !== now.getMonth() ||
    selected.getDate() !== now.getDate()
  ) {
    return false
  }

  const [hour, minute] = slotTime.split(":").map(Number)
  const slotDate = new Date()
  slotDate.setHours(hour, minute, 0, 0)

  return slotDate <= now
}
