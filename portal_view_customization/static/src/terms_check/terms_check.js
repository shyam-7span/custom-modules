/** @odoo-module **/

import { Component, onMounted, useRef, useState } from "@odoo/owl";
import dom from "@web/legacy/js/core/dom";
import { _t } from "@web/core/l10n/translation";
import { registry } from "@web/core/registry";
import { redirect } from "@web/core/utils/urls";
import { NameAndSignature } from "@web/core/signature/name_and_signature";
import { useService } from "@web/core/utils/hooks";

/**
 * This Component is a signature request form. It uses
 * @see NameAndSignature for the input fields, adds a submit
 * button, and handles the RPC to save the result.
 */
class SignatureForm extends Component {
  static template = "portal.SignatureForm";
  static components = { NameAndSignature };

  setup() {
    this.rootRef = useRef("root");
    this.rpc = useService("rpc");

    this.csrfToken = odoo.csrf_token;
    this.state = useState({
      error: false,
      success: false,
    });
    this.signature = useState({
      name: this.props.defaultName || "",
      check: false,
      location: "", // Initialize location as an empty string
    });

    this.nameAndSignatureProps = {
      signature: this.signature,
      fontColor: this.props.fontColor || "black",
    };

    if (this.props.signatureRatio) {
      this.nameAndSignatureProps.displaySignatureRatio =
        this.props.signatureRatio;
    }
    if (this.props.signatureType) {
      this.nameAndSignatureProps.signatureType = this.props.signatureType;
    }
    if (this.props.mode) {
      this.nameAndSignatureProps.mode = this.props.mode;
    }

    onMounted(() => {
      const checkboxTerms = document.querySelector("#check_condition");
      if (checkboxTerms) {
        checkboxTerms.addEventListener("change", (event) => {
          this.signature.check = event.target.checked;
          console.log("Checkbox is now:", event.target.checked);
        });
      }

      const locationInput = document.querySelector("#locationId");
      if (locationInput) {
        this.signature.location = locationInput.value; // Set the location value
        console.log("Location set to:", this.signature.location);
      }

      // Reset signature on modal show
      this.rootRef.el
        .closest(".modal")
        .addEventListener("shown.bs.modal", () => {
          this.signature.resetSignature();
        });
    });
  }

  get sendLabel() {
    return this.props.sendLabel || _t("Accept & Sign");
  }

  /**
   * Handles click on the submit button.
   *
   * This will get the current name and signature and validate them.
   * If they are valid, they are sent to the server, and the response is
   * handled. If they are invalid, it will display the errors to the user.
   *
   * @returns {Promise}
   */
  async onClickSubmit() {
    const button = document.querySelector(".o_portal_sign_submit");
    const icon = button.removeChild(button.firstChild);
    const restoreBtnLoading = dom.addButtonLoadingEffect(button);

    const name = this.signature.name;
    const signature = this.signature.getSignatureImage()[1];
    const data = await this.rpc(this.props.callUrl, { name, signature });

    if (data.force_refresh) {
      restoreBtnLoading();
      button.prepend(icon);
      if (data.redirect_url) {
        redirect(data.redirect_url);
      } else {
        window.location.reload();
      }
      return new Promise(() => {}); // Prevents resolving if reloading
    }
    this.state.error = data.error || false;
    this.state.success = !data.error && {
      message: data.message,
      redirectUrl: data.redirect_url,
      redirectMessage: data.redirect_message,
    };
  }
}

registry
  .category("public_components")
  .add("portal.signature_form", SignatureForm);
