<template>
  <div
    class="modal fade"
    id="modal_check_in_apt"
    tabindex="-1"
    aria-hidden="true"
    ref="checkInAptModalRef"
  >
    <!--begin::Modal dialog-->
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <!--begin::Modal content-->
      <div class="modal-content">
        <!--begin::Modal header-->
        <div class="modal-header" id="kt_modal_add_customer_header">
          <!--begin::Modal title-->
          <h2 class="fw-bolder">
            Check In {{ aptData.first_name }} {{ aptData.last_name }}
          </h2>
          <!--end::Modal title-->
          <div>
            <div class="btn btn-lg btn-light-danger me-3 mb-1">
              Print Hospital Cerificate
            </div>
            <div
              id="kt_modal_add_customer_close"
              data-bs-dismiss="modal"
              class="btn btn-icon btn-sm btn-active-icon-primary"
            >
              <span class="svg-icon svg-icon-1">
                <InlineSVG icon="cross" />
              </span>
            </div>
          </div>
          <!--begin::Close-->
          <!--end::Close-->
        </div>
        <!--end::Modal header-->
        <!--begin::Modal body-->
        <div class="modal-body py-10 px-lg-17">
          <!--begin::Scroll-->
          <div
            class="scroll-y me-n7 pe-7"
            id="kt_modal_add_customer_scroll"
            data-kt-scroll="true"
            data-kt-scroll-activate="{default: false, lg: true}"
            data-kt-scroll-max-height="auto"
            data-kt-scroll-dependencies="#kt_modal_add_customer_header"
            data-kt-scroll-wrappers="#kt_modal_add_customer_scroll"
            data-kt-scroll-offset="300px"
          >
            <el-form>
              <!--begin::Input group-->
              <div class="card-info">
                <div class="fs-3 fw-bold text-muted mb-6">
                  Doctor Address Book Information
                </div>
                <div class="row">
                  <div class="col-sm-6">
                    <!--begin::Input group-->
                    <div class="fv-row mb-7">
                      <!--begin::Label-->
                      <label class="fs-6 fw-bold mb-2">
                        Doctor Address Book
                      </label>
                      <!--end::Label-->
                      <!--begin::Input-->
                      <el-form-item prop="doctor_address_book">
                        <el-autocomplete
                          class="w-100"
                          v-model="aptData.doctor_address_book_name"
                          value-key="full_name"
                          :fetch-suggestions="searchDoctorAddressBook"
                          placeholder="Please input"
                          :trigger-on-focus="false"
                          @select="handleSelect"
                        >
                          <template #default="{ item }">
                            <div class="name">
                              {{ item.title }}
                              {{ item.first_name }} {{ item.last_name }}
                            </div>
                            <div class="address">{{ item.address }}</div>
                          </template>
                        </el-autocomplete>
                      </el-form-item>
                      <!--end::Input-->
                    </div>
                    <!--end::Input group-->
                  </div>

                  <div class="col-sm-6">
                    <!--begin::Input group-->
                    <div class="fv-row mb-7">
                      <!--begin::Label-->
                      <label class="fs-6 fw-bold mb-2">Doctor Address</label>
                      <!--end::Label-->
                      <!--begin::Input-->
                      <el-form-item prop="doctor_address_file">
                        <el-space wrap>
                          <el-upload
                            action="#"
                            ref="upload"
                            class="mr-20"
                            :limit="1"
                            :auto-upload="false"
                          >
                            <el-button type="primary" class="btn btn-primary"
                              >Choose File</el-button
                            >
                          </el-upload>
                          <button
                            v-show="
                              aptData.referral_file !== null &&
                              aptData.referral_file !== ''
                            "
                            class="btn btn-success"
                            @click="handleClickReferralFile"
                          >
                            View
                          </button>
                        </el-space>
                      </el-form-item>
                      <!--end::Input-->
                    </div>
                    <!--end::Input group-->
                  </div>

                  <div class="col-sm-6">
                    <!--begin::Input group-->
                    <div class="fv-row mb-7">
                      <!--begin::Label-->
                      <label class="fs-6 fw-bold mb-2">Referral Date</label>
                      <!--end::Label-->
                      <!--begin::Input-->
                      <el-form-item prop="referral_date">
                        <el-date-picker
                          class="w-100"
                          v-model="aptData.referral_date"
                          format="YYYY-MM-DD"
                          placeholder="Enter Referral Date"
                        />
                      </el-form-item>
                      <!--end::Input-->
                    </div>
                    <!--end::Input group-->
                  </div>

                  <div class="col-sm-6">
                    <!--begin::Input group-->
                    <div class="fv-row mb-7">
                      <!--begin::Label-->
                      <label class="fs-6 fw-bold mb-2">Referral Duration</label>
                      <!--end::Label-->
                      <!--begin::Input-->
                      <el-form-item prop="c">
                        <el-input
                          type="number"
                          class="w-50 text-center col mr-4"
                          :min="0"
                          :max="24"
                          v-model="aptData.referral_duration"
                        />
                        Months
                      </el-form-item>
                      <!--end::Input-->
                    </div>
                    <!--end::Input group-->
                  </div>
                </div>
              </div>
              <el-divider />
              <div class="card-info">
                <div class="fs-3 fw-bold text-muted mb-6">Colleting Person</div>
                <div class="row">
                  <div class="col-sm-6">
                    <!--begin::Input group-->
                    <div class="fv-row mb-7">
                      <!--begin::Label-->
                      <label class="fs-6 fw-bold mb-2">Name</label>
                      <!--end::Label-->

                      <!--begin::Input-->
                      <el-form-item prop="collecting_person_name">
                        <el-input
                          type="text"
                          v-model="aptData.collecting_person_name"
                          placeholder="Enter Name"
                        />
                      </el-form-item>
                      <!--end::Input-->
                    </div>
                    <!--end::Input group-->
                  </div>

                  <div class="col-sm-6">
                    <!--begin::Input group-->
                    <div class="fv-row mb-7">
                      <!--begin::Label-->
                      <label class="fs-6 fw-bold mb-2">Phone Number</label>
                      <!--end::Label-->

                      <!--begin::Input-->
                      <el-form-item prop="collecting_person_phone">
                        <el-input
                          type="text"
                          v-model="aptData.collecting_person_phone"
                          placeholder="Enter Phone Number"
                        />
                      </el-form-item>
                      <!--end::Input-->
                    </div>
                    <!--end::Input group-->
                  </div>

                  <div class="col-sm-12">
                    <!--begin::Input group-->
                    <div class="fv-row mb-7">
                      <!--begin::Label-->
                      <label class="fs-6 fw-bold mb-2">Contact</label>
                      <!--end::Label-->

                      <!--begin::Input-->
                      <el-form-item prop="collecting_person_alternate_contact">
                        <el-input
                          type="text"
                          v-mask="'0#-####-####'"
                          v-model="aptData.collecting_person_alternate_contact"
                          placeholder="Enter Phone Number"
                        />
                      </el-form-item>
                      <!--end::Input-->
                    </div>
                    <!--end::Input group-->
                  </div>
                </div>
              </div>
              <!--end::Input group-->
            </el-form>
          </div>
          <!--end::Scroll-->
        </div>
        <!--end::Modal body-->

        <!--begin::Modal footer-->
        <div class="modal-footer flex-center">
          <!--begin::Button-->
          <button
            :data-kt-indicator="loadingPay ? 'on' : null"
            class="btn btn-lg btn-primary"
            @click="handleCheckIn(true)"
          >
            <span v-if="!loadingPay" class="indicator-label">
              Make Payment and Check In
            </span>
            <span v-if="loadingPay" class="indicator-progress">
              Please wait...
              <span
                class="spinner-border spinner-border-sm align-middle ms-2"
              ></span>
            </span>
          </button>

          <button
            :data-kt-indicator="loading ? 'on' : null"
            class="btn btn-lg btn-primary"
            @click="handleCheckIn(false)"
          >
            <span v-if="!loading" class="indicator-label"> Check In Only </span>
            <span v-if="loading" class="indicator-progress">
              Please wait...
              <span
                class="spinner-border spinner-border-sm align-middle ms-2"
              ></span>
            </span>
          </button>
          <!--end::Button-->
        </div>
        <!--end::Modal footer-->
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed, ref, onMounted } from "vue";
import { Actions } from "@/store/enums/StoreEnums";
import { AppointmentActions } from "@/store/enums/StoreAppointmentEnums";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { hideModal } from "@/core/helpers/dom";
import { DrawerComponent } from "@/assets/ts/components/_DrawerComponent";

import { mask } from "vue-the-mask";
// import { validatePhone } from "@/helpers/helpers.js";

export default defineComponent({
  name: "create-apt-modal",
  directives: {
    mask,
  },
  components: {},
  setup() {
    const store = useStore();
    const aptData = computed(() => store.getters.getAptSelected);
    const doctorAddressBooks = computed(
      () => store.getters.getDoctorAddressBookList
    );
    const checkInAptModalRef = ref(null);
    const router = useRouter();
    const loadingPay = ref(false);
    const loading = ref(false);

    const handleSelect = (item) => {
      aptData.value.doctor_address_book_id = item.id;
    };

    let timeout;
    const searchDoctorAddressBook = (term, cb) => {
      const results = term
        ? doctorAddressBooks.value.filter(createFilter(term))
        : doctorAddressBooks.value;

      clearTimeout(timeout);
      timeout = setTimeout(() => {
        cb(results);
      }, 1000);
    };

    const createFilter = (term) => {
      const keyword = term.toString();
      return (doctorAddressBook) => {
        const full_name =
          doctorAddressBook.title +
          " " +
          doctorAddressBook.first_name +
          " " +
          doctorAddressBook.last_name;
        const full_name_pos = full_name
          .toLowerCase()
          .indexOf(keyword.toLowerCase());
        const address_pos = doctorAddressBook.address
          .toLowerCase()
          .indexOf(keyword.toLowerCase());
        return full_name_pos !== -1 || address_pos !== -1;
      };
    };

    const handleClickReferralFile = () => {
      window.open(aptData.value.referral_file, "_blank");
    };

    const handleCheckIn = async (is_move) => {
      if (is_move) loadingPay.value = true;
      else loading.value = true;
      await store
        .dispatch(AppointmentActions.APT.CHECK_IN, aptData.value)
        .then(() => {
          store.dispatch(AppointmentActions.LIST).then(() => {
            if (is_move) loadingPay.value = false;
            else loading.value = false;
            hideModal(checkInAptModalRef.value);
            if (is_move === true) {
              router.push({ name: "make-payment-pay" });
              store.dispatch(Actions.MAKE_PAYMENT.VIEW, aptData.value.id);
              DrawerComponent?.getInstance("appointment-drawer")?.hide();
            } else {
              DrawerComponent?.getInstance("appointment-drawer")?.hide();
            }
          });
        })
        .catch(({ response }) => {
          console.log(response);
        });
    };

    onMounted(() => {
      store.dispatch(Actions.DOCTOR_ADDRESS_BOOK.LIST);
    });

    return {
      aptData,
      handleClickReferralFile,
      handleCheckIn,
      searchDoctorAddressBook,
      handleSelect,
      checkInAptModalRef,
      loading,
      loadingPay,
    };
  },
});
</script>
