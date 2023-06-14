import { EncodeObject } from "@cosmjs/proto-signing";
import { assert } from "@cosmjs/utils";
import { MsgSetWithdrawAddress } from "cosmjs-types/cosmos/distribution/v1beta1/tx";
import { useEffect, useState } from "react";
import { MsgGetter } from "..";
import { useAppContext } from "../../../../context/AppContext";
import { checkAddress, exampleAddress } from "../../../../lib/displayHelpers";
import { MsgTypeUrls } from "../../../../types/txMsg";
import Input from "../../../inputs/Input";
import StackableContainer from "../../../layout/StackableContainer";

interface MsgSetWithdrawAddressFormProps {
  readonly delegatorAddress: string;
  readonly setMsgGetter: (msgGetter: MsgGetter) => void;
  readonly deleteMsg: () => void;
}

const MsgSetWithdrawAddressForm = ({
  delegatorAddress,
  setMsgGetter,
  deleteMsg,
}: MsgSetWithdrawAddressFormProps) => {
  const { state } = useAppContext();
  assert(state.chain.addressPrefix, "addressPrefix missing");

  const [withdrawAddress, setWithdrawAddress] = useState("");
  const [withdrawAddressError, setWithdrawAddressError] = useState("");

  useEffect(() => {
    try {
      setWithdrawAddressError("");

      const isMsgValid = (): boolean => {
        assert(state.chain.addressPrefix, "addressPrefix missing");

        const addressErrorMsg = checkAddress(withdrawAddress, state.chain.addressPrefix);
        if (addressErrorMsg) {
          setWithdrawAddressError(
            `Invalid address for network ${state.chain.chainId}: ${addressErrorMsg}`,
          );
          return false;
        }

        return true;
      };

      const msgValue: MsgSetWithdrawAddress = { delegatorAddress, withdrawAddress };
      const msg: EncodeObject = { typeUrl: MsgTypeUrls.SetWithdrawAddress, value: msgValue };

      setMsgGetter({ isMsgValid, msg });
    } catch {}
  }, [
    delegatorAddress,
    setMsgGetter,
    state.chain.addressPrefix,
    state.chain.chainId,
    withdrawAddress,
  ]);

  return (
    <StackableContainer lessPadding lessMargin>
      <button className="remove" onClick={() => deleteMsg()}>
        ✕
      </button>
      <h2>MsgSetWithdrawAddress</h2>
      <div className="form-item">
        <Input
          label="Withdraw Address"
          name="withdraw-address"
          value={withdrawAddress}
          onChange={({ target }) => setWithdrawAddress(target.value)}
          error={withdrawAddressError}
          placeholder={`E.g. ${exampleAddress(0, state.chain.addressPrefix)}`}
        />
      </div>
      <style jsx>{`
        .form-item {
          margin-top: 1.5em;
        }
        button.remove {
          background: rgba(255, 255, 255, 0.2);
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: none;
          color: white;
          position: absolute;
          right: 10px;
          top: 10px;
        }
      `}</style>
    </StackableContainer>
  );
};

export default MsgSetWithdrawAddressForm;
