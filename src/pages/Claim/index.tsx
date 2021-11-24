import React, { useState } from 'react'
import AppBody from "../AppBody";
import {Wrapper} from "../../components/swap/styleds";
import PurchaseForm, {Data } from "../../components/PurchaseForm"
import { useActiveWeb3React } from "../../hooks";
import { usePresaleContract } from '../../hooks/useContract'
import { useOpenStatus, useUserUnclaimedAmount } from '../../state/presale/hooks'
import {ButtonPrimary} from "../../components/Button";
import { Dots } from '../../components/swap/styleds'
import { useTranslation } from 'react-i18next'
import AddSPC from "../../components/AddSPC";
import { Text, /* Text */ } from 'rebass'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from '../../state/transactions/hooks'
import styled from "styled-components";

const FormInner = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid rgb(86, 90, 105);
  padding: 16px 12px;
  border-radius: 12px;
`;


export default function Claim() {

  const { t } = useTranslation()
  const { account } = useActiveWeb3React()
  const isOpen = useOpenStatus()
  const unClaimed = useUserUnclaimedAmount(account)
  
  console.log('debug->unClaimed', unClaimed)
  const handleSubmit = (data: Data) => {
    console.log(1);
  }

  const addTransaction = useTransactionAdder()
  const [attempting, setAttempting] = useState<boolean>(false)
  const [hash, setHash] = useState<string | undefined>()
  const presaleContract = usePresaleContract()

  async function onClaim() {
    if (presaleContract) {
      setAttempting(true)
      const method = 'claim'
      if (unClaimed?.toExact) {
        presaleContract
          [method]()
          .then((response: TransactionResponse) => {
            addTransaction(response, {
              summary: t("Claimed SPCs successfully")
            });
            setHash(response.hash);
            setAttempting(false);
          })
          .catch((error: any) => {
            setAttempting(false);
            console.error(error);
          })
      } else {
        setAttempting(false)
        throw new Error(t('Something went wrong'))
      }
    }
  }

  return (
    <>
      <AppBody>
        <Wrapper id="normal-page">
          <Text fontSize="30px" textAlign="center" mb="30px">{t('Claim your SPC')}</Text>
          <PurchaseForm onSubmit={handleSubmit}>
            <FormInner>
              {!isOpen ? 
                <>
                  <Text fontSize="18px" textAlign="center" mt="20px" mb="20px">{t('You can claim your SPCs')}</Text>
                  <Text fontSize="18px" textAlign="center" mb="20px">{unClaimed?.toExact()} SPCs are claimable for you</Text>
                  <ButtonPrimary
                    onClick={onClaim}
                    disabled={attempting && !hash}
                    width='100%'
                    style={{ margin: '20px 0 0 0' }}
                  >
                    {attempting ? (
                      <Dots>Claiming SPC</Dots>
                    ) : (
                      t('Claim')
                    )}
                  </ButtonPrimary>
                </>
                :
                <>
                <Text fontSize="18px" textAlign="center" mt="20px" mb="20px">{t('Presale is not over yet')}</Text>
                <Text fontSize="18px" textAlign="center" mb="20px">{t('Please wait until presale ends')}</Text>
                </>
              }
            </FormInner>
          </PurchaseForm>
          <AddSPC />
        </Wrapper>
      </AppBody>
    </>
    )
}
