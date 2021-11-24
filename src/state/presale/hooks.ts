import { usePresaleContract } from '../../hooks/useContract'
import { TokenAmount, JSBI } from '@pangolindex/sdk'
import { PNG } from './../../constants/index'
import { useSingleCallResult } from '../multicall/hooks'


export function useMinLimit() {
	const presaleContract = usePresaleContract()
	const response = useSingleCallResult(presaleContract, 'minMimLimit', [])
	const result = response.result ? JSBI.BigInt(response.result?.[0]) : JSBI.BigInt(0)
	return result
}

export function useMaxLimit() {
	const presaleContract = usePresaleContract()
	const response = useSingleCallResult(presaleContract, 'maxMimLimit', [])
	const result = response.result ? JSBI.BigInt(response.result?.[0]) : JSBI.BigInt(0)
	return result
}

export function useMaxLimitVip() {
	const presaleContract = usePresaleContract()
	const response = useSingleCallResult(presaleContract, 'maxMimLimitVip', [])
	const result = response.result ? JSBI.BigInt(response.result?.[0]) : JSBI.BigInt(0)
	return result
}

export function useTokenPrice() {
	const presaleContract = usePresaleContract()
	const response = useSingleCallResult(presaleContract, 'tokenPrice', [])
	const result = response.result ? JSBI.BigInt(response.result?.[0]) : JSBI.BigInt(0)
	return result
}

export function useOpenStatus() {
	const presaleContract = usePresaleContract()
	const response = useSingleCallResult(presaleContract, 'isPresaleOpen', [])
	const result = response.result ? response.result?.[0] : false
	return result
}

export function useAllowedVipBuy(account: string | null | undefined): boolean {
	const presaleContract = usePresaleContract()
	const response = useSingleCallResult(presaleContract, 'vipWhiteListed', [account ? account : undefined])
	const res = Boolean(account && !response.loading && response.result !== undefined && response.result[0] === true)
	return res
}

export function useAllowedBuy(account: string | null | undefined): boolean {
	const presaleContract = usePresaleContract()
	const response = useSingleCallResult(presaleContract, 'whiteListed', [account ? account : undefined])
	const res = Boolean(account && !response.loading && response.result !== undefined && response.result[0] === true)
	return res
}

export function useUserUnclaimedAmount(account: string | null | undefined): TokenAmount | undefined {
	
	const presaleContract = usePresaleContract()
	const response = useSingleCallResult(presaleContract, 'usersSaleInfo', [account ? account : undefined])
	const spc = PNG[43114]
	const res = account && response.result ? new TokenAmount(spc, JSBI.BigInt(response.result?.[1])) : new TokenAmount(spc, JSBI.BigInt(0))
	return res
}