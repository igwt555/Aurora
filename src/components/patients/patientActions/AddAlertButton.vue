<template>
  <LargeIconButton text="Add Alert" @click="handleAddAlert" />
  <CreatePatientAlertModal :patientId="patient.id" />
</template>

<script lang="ts">
import { Modal } from "bootstrap";
import { PropType } from "vue";
import CreatePatientAlertModal from "@/views/patients/modals/CreatePatientAlertModal.vue";
import IPatient from "@/store/interfaces/IPatient";
export default {
  components: { CreatePatientAlertModal },
  props: {
    patient: {
      required: true,
      type: Object as PropType<IPatient>,
    },
  },
  setup() {
    const handleAddAlert = () => {
      const modal = new Modal(document.getElementById("modal_patient_alert"));
      modal.show();
    };

    return { handleAddAlert };
  },
};
</script>
