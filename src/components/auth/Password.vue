<template>
  <!--begin::Navbar-->
  <div class="card pb-9">
    <ProfileNavigation />
    <div class="card-body pt-9 pb-0">
      <!--begin::Details-->
      <el-form
        @submit.prevent="submit()"
        :model="formData"
        :rules="rules"
        ref="formRef"
      >
        <div class="row">
          <div class="col-sm-12">
            <div class="fv-row mb-7">
              <el-form-item>
                <label class="text-muted fs-6 fw-bold mb-2 d-block"
                  >Old Password</label
                >
                <el-form-item prop="old_password">
                  <el-input
                    type="password"
                    class="w-50"
                    v-model="formData.old_password"
                    placeholder="Old Password"
                  />
                </el-form-item>
              </el-form-item>
            </div>
          </div>
          <div class="col-sm-6">
            <div class="fv-row mb-7" data-kt-password-meter="true">
              <label class="text-muted fs-6 fw-bold mb-2 d-block"
                >New Password</label
              >
              <el-form-item prop="new_password">
                <el-input
                  type="password"
                  class="w-100"
                  v-model="formData.new_password"
                  placeholder="New Password"
                />
                <span
                  class="btn btn-sm btn-icon position-absolute translate-middle top-50 end-0 me-n2"
                  data-kt-password-meter-control="visibility"
                >
                  <i class="bi bi-eye-slash fs-2"></i>
                  <i class="bi bi-eye fs-2 d-none"></i>
                </span>
              </el-form-item>
              <div
                class="d-flex align-items-center mb-3"
                data-kt-password-meter-control="highlight"
              >
                <div
                  class="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"
                ></div>
                <div
                  class="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"
                ></div>
                <div
                  class="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"
                ></div>
                <div
                  class="flex-grow-1 bg-secondary bg-active-success rounded h-5px"
                ></div>
              </div>
            </div>
          </div>
          <div class="col-sm-6">
            <div class="fv-row mb-7">
              <label class="text-muted fs-6 fw-bold mb-2 d-block"
                >New Password Confirmation</label
              >
              <el-form-item prop="confirm_password">
                <el-input
                  type="password"
                  class="w-100"
                  v-model="formData.confirm_password"
                  placeholder="New Password Confirm"
                />
              </el-form-item>
            </div>
          </div>
        </div>
        <div class="d-flex ms-auto justify-content-end w-25">
          <button type="submit" class="btn btn-primary w-25">Save</button>
          <button type="reset" class="btn btn-light-primary w-25 ms-2">
            Cancel
          </button>
        </div>
      </el-form>
      <!--end::Details-->
    </div>
  </div>
  <!--end::Navbar-->
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { setCurrentPageBreadcrumbs } from "@/core/helpers/breadcrumb";
import { useStore } from "vuex";
import { Actions } from "@/store/enums/StoreEnums";
import Swal from "sweetalert2/dist/sweetalert2.js";
import ProfileNavigation from "@/components/auth/ProfileNavigation";
import { PasswordMeterComponent } from "@/assets/ts/components/_PasswordMeterComponent";
import { validatePass } from "@/helpers/helpers.js";

export default defineComponent({
  name: "password-change",
  components: { ProfileNavigation },
  setup() {
    const store = useStore();
    const formRef = ref(null);
    const formData = ref({
      old_password: "",
      new_password: "",
      confirm_password: "",
    });
    const loading = ref(false);

    const validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please input the password again"));
      } else if (value !== formData.value.new_password) {
        callback(new Error("Password doesn't match!"));
      } else {
        callback();
      }
    };

    const rules = ref({
      old_password: [
        {
          required: true,
          message: "Password cannot be blank",
          trigger: "change",
        },
        { min: 6, message: "The password must be at least 6 characters" },
      ],
      new_password: [
        { validator: validatePass, trigger: "blur" },
        {
          required: true,
          message: "Password cannot be blank",
          trigger: "change",
        },
        { min: 6, message: "The password must be at least 6 characters" },
      ],
      confirm_password: [
        { validator: validatePass2, trigger: "blur" },
        {
          required: true,
          message: "Confirm Password cannot be blank.",
          trigger: "change",
        },
        { min: 6, message: "The password must be at least 6 characters" },
      ],
    });

    const submit = () => {
      if (!formRef.value) {
        return;
      }

      formRef.value.validate((valid) => {
        if (valid) {
          loading.value = true;
          store
            .dispatch(Actions.PROFILE.UPDATE_PASSWORD, formData.value)
            .then(() => {
              loading.value = false;
              store.dispatch(Actions.PROFILE.VIEW);
              Swal.fire({
                text: "Successfully Updated!",
                icon: "success",
                buttonsStyling: false,
                confirmButtonText: "Ok, got it!",
                customClass: {
                  confirmButton: "btn btn-primary",
                },
              });
            })
            .finally(() => {
              loading.value = false;
            });
        }
      });
    };

    onMounted(() => {
      setCurrentPageBreadcrumbs("Password", ["Profile"]);
      PasswordMeterComponent.createInstances();
    });

    return {
      formData,
      formRef,
      rules,
      submit,
    };
  },
});
</script>
