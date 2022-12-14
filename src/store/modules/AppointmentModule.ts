import ApiService from "@/core/services/ApiService";
import JwtService from "@/core/services/JwtService";
import { Mutations } from "@/store/enums/StoreEnums";
import {
  AppointmentActions,
  AppointmentMutations,
} from "@/store/enums/StoreAppointmentEnums";
import {
  displayServerError,
  displaySuccessModal,
  displaySuccessToast,
} from "@/helpers/helpers.js";
import { Module, Action, Mutation, VuexModule } from "vuex-module-decorators";
import moment from "moment";
import Swal from "sweetalert2/dist/sweetalert2.js";
import router from "@/router";
import IAppointment from "../interfaces/IAppointment";

export interface AptInfo {
  aptData: Array<IAppointment>;
  aptSelectData: IAppointment;
  aptPreAdmissionOrgData: IAppointment;
  aptPreAdmissionValidateData: IAppointment;
  aptPreAdmissionValidateMsg: string;
  selectedSpecialistData;
  userAptList: Array<IAppointment>;
  aptUserSelectedData: IAppointment;
}

@Module
export default class AppointmentModule extends VuexModule implements AptInfo {
  aptData = [] as Array<IAppointment>;
  aptSelectData = {} as IAppointment;
  aptPreAdmissionOrgData = {} as IAppointment;
  aptPreAdmissionValidateData = {} as IAppointment;
  aptPreAdmissionValidateMsg = "" as string;
  selectedSpecialistData = null;
  userAptList = [] as Array<IAppointment>;
  aptUserSelectedData = {} as IAppointment;
  /**
   * Get current user object
   * @returns AdminList
   */
  get getAptList(): Array<IAppointment> {
    return this.aptData;
  }

  /**
   * Get current user object
   * @returns SelectedaptData
   */
  get getAptSelected(): IAppointment {
    return this.aptSelectData;
  }

  /**
   * Get current user object
   * @returns Selected specialist data
   */
  get getSelectedSpecialist() {
    return this.selectedSpecialistData;
  }

  /**
   * Get current user object
   * @returns SelectedaptData
   */
  get getAptPreAdmissionOrg(): IAppointment {
    return this.aptPreAdmissionOrgData;
  }

  /**
   * Get current user object
   * @returns SelectedaptData
   */
  get getAptPreAdmissionValidateData(): IAppointment {
    return this.aptPreAdmissionValidateData;
  }

  /**
   * Get current user object
   * @returns SelectedaptData
   */
  get getAptPreAdmissionValidateMsg(): string {
    return this.aptPreAdmissionValidateMsg;
  }

  /**
   * Get current user apt list
   * @returns SelectedaptData
   */
  get getUserAptList(): Array<IAppointment> {
    return this.userAptList;
  }

  /**
   * Get current selected appointment
   * @returns SelectedaptData
   */
  get getAptUserSelected(): IAppointment {
    return this.aptUserSelectedData;
  }

  @Mutation
  [AppointmentMutations.SET_APT.LIST](aptData) {
    this.aptData = aptData;
  }

  @Mutation
  [AppointmentMutations.SET_APT.SELECT](data) {
    this.aptSelectData = data;
  }

  @Mutation
  [AppointmentMutations.SET_APT.SELECT_SPECIALIST](data) {
    this.selectedSpecialistData = data;
  }

  @Mutation
  [AppointmentMutations.SET_APT.PRE_ADMISSION.ORG](data) {
    this.aptPreAdmissionOrgData = data;
  }

  @Mutation
  [AppointmentMutations.SET_APT.PRE_ADMISSION.VALIDATE.DATA](data) {
    this.aptPreAdmissionValidateData = data;
  }

  @Mutation
  [AppointmentMutations.SET_APT.PRE_ADMISSION.VALIDATE.MSG](data) {
    this.aptPreAdmissionValidateMsg = data;
  }

  @Mutation
  [AppointmentMutations.SET_APT.USER_APT.SELECT](data) {
    this.aptUserSelectedData = data;
  }

  @Action
  [AppointmentActions.LIST](params) {
    if (JwtService.getToken()) {
      ApiService.setHeader();
      return ApiService.query("appointments", { params: params })
        .then(({ data }) => {
          this.context.commit(AppointmentMutations.SET_APT.LIST, data.data);
          return data.data;
        })
        .catch(({ response }) => {
          return displayServerError(response, "Listing all appointments");
        });
    } else {
      this.context.commit(Mutations.PURGE_AUTH);
    }
  }

  @Action
  [AppointmentActions.CONFIRMATION_STATUS.UPDATE](data) {
    if (JwtService.getToken()) {
      ApiService.setHeader();
      ApiService.update("appointments/confirmation-status", data.id, {
        confirmation_status: data.confirmed
          ? "CONFIRMED"
          : data.missed
          ? "MISSED"
          : "CANCELED",
        confirmation_status_reason: data.reason,
      })
        .then(({ data }) => {
          return data.data;
        })
        .catch(({ response }) => {
          return displayServerError(
            response,
            "Updating appointment confirmation status"
          );
        });
    } else {
      this.context.commit(Mutations.PURGE_AUTH);
    }
  }

  @Action
  [AppointmentActions.APT.CREATE](payload) {
    if (JwtService.getToken()) {
      ApiService.setHeader();
      return ApiService.post("appointments", payload).catch(({ response }) => {
        return displayServerError(response, "Creating an appointment");
      });
    } else {
      this.context.commit(Mutations.PURGE_AUTH);
    }
  }

  @Action
  [AppointmentActions.APT.UPDATE](item) {
    if (JwtService.getToken()) {
      ApiService.setHeader();
      return ApiService.update("appointments", item.id, item)
        .then(({ data }) => {
          return data.data;
        })
        .catch(({ response }) => {
          return displayServerError(response, "Updating an appointment");
        });
    } else {
      this.context.commit(Mutations.PURGE_AUTH);
    }
  }

  @Action
  [AppointmentActions.COLLECTING_PERSON.UPDATE](item) {
    if (JwtService.getToken()) {
      ApiService.setHeader();
      ApiService.update("appointments/collecting-person", item.id, item)
        .then(({ data }) => {
          return data.data;
        })
        .catch(({ response }) => {
          return displayServerError(
            response,
            "Updating appointment collecting person"
          );
        });
    } else {
      this.context.commit(Mutations.PURGE_AUTH);
    }
  }

  @Action
  [AppointmentActions.APT.CHECK_IN](data) {
    if (JwtService.getToken()) {
      ApiService.setHeader();
      ApiService.update("appointments/check-in", data.id, data)
        .then(({ data }) => {
          return data.data;
        })
        .catch(({ response }) => {
          return displayServerError(response, "Checking in an appointment");
        });
    } else {
      this.context.commit(Mutations.PURGE_AUTH);
    }
  }

  @Action
  [AppointmentActions.APT.CHECK_OUT](data) {
    if (JwtService.getToken()) {
      ApiService.setHeader();
      ApiService.update("appointments/check-out", data.id, {})
        .then(({ data }) => {
          return data.data;
        })
        .catch(({ response }) => {
          return displayServerError(response, "Checking out an appointment");
        });
    } else {
      this.context.commit(Mutations.PURGE_AUTH);
    }
  }

  @Action
  [AppointmentActions.PRE_ADMISSION.ORGANIZATION](id) {
    ApiService.get("appointments/pre-admissions/show/" + id)
      .then(({ data }) => {
        this.context.commit(
          AppointmentMutations.SET_APT.PRE_ADMISSION.ORG,
          data.data
        );
        return data.data;
      })
      .catch(({ response }) => {
        return displayServerError(response, "Displaying pre admissions");
      });
  }

  @Action
  [AppointmentActions.PRE_ADMISSION.STORE](data) {
    console.log(data);
    ApiService.post("appointments/pre-admissions/store/" + data.apt_id, data)
      .then(({ data }) => {
        return data.message;
      })
      .catch(({ response }) => {
        return displayServerError(response, "Storing a pre admissions form");
      });
  }

  @Action
  [AppointmentActions.REFERRAL.UPDATE](data) {
    return ApiService.post(
      "appointments/referral/" + data.appointment_id,
      data.submitData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )
      .then(({ data }) => {
        return data;
      })
      .catch(({ response }) => {
        return displayServerError(response, "Updating a referral");
      });
  }

  @Action
  [AppointmentActions.PRE_ADMISSION.VALIDATE](params) {
    ApiService.setHeader();
    ApiService.post("appointments/pre-admissions/validate/" + params.id, {
      last_name: params.last_name,
      date_of_birth: moment(params.date_of_birth)
        .format("YYYY-MM-DD")
        .toString(),
    })
      .then(({ data }) => {
        this.context.commit(
          AppointmentMutations.SET_APT.PRE_ADMISSION.VALIDATE.MSG,
          data.message
        );
        this.context.commit(
          AppointmentMutations.SET_APT.PRE_ADMISSION.VALIDATE.DATA,
          data.data
        );
        router.push({
          path: "/appointment_pre_admissions/show/" + params.id + "/form_2",
        });
        return data.message;
      })
      .catch(({ response }) => {
        if (response.status === 403) {
          Swal.fire({
            text: response.data.message,
            icon: "error",
            buttonsStyling: false,
            confirmButtonText: "Ok",
            customClass: {
              confirmButton: "btn btn-primary",
            },
          }).then(() => {
            this.context.commit(
              AppointmentMutations.SET_APT.PRE_ADMISSION.VALIDATE.MSG,
              response.data.message
            );
          });
          //this.context.commit(Mutations.SET_ERROR, response.data.errors);
        } else {
          return displayServerError(
            response,
            "Validating a pre admission form view"
          );
        }
      });
  }

  @Action
  [AppointmentActions.DETAIL.UPDATE](data) {
    return ApiService.post(`appointments/${data.appointment_id}/detail`, data)
      .then(({ data }) => {
        return data;
      })
      .catch(({ response }) => {
        return displayServerError(response, "Updating appointment detail's");
      });
  }
}
