import { Post, Memento, User, Comment } from './model'
import { math, base58 } from 'near-sdk-as'

export function generateId(): string {
	const buff = math.randomBuffer(16)

	var randomId = base58.encode(buff)
	return randomId.replaceAll('/', '')
}

export function mergeSortPostList(arr: Post[]) : Post[] {
	if (arr.length < 2)
		return arr;


	var middle = floor(arr.length / 2)
	var left   = arr.slice(0, middle)
	var right  = arr.slice(middle, arr.length)

	return _mergePostList(mergeSortPostList(left), mergeSortPostList(right));
}

function _mergePostList(left: Post[], right: Post[]): Post[] {
		var result: Post[] = [];
		
		while (left.length && right.length) {
			if (left[0].createdAt >= right[0].createdAt) {
				result.push(left.shift());
			} else {
				result.push(right.shift());
			}
		}

		while (left.length)
			result.push(left.shift());

		while (right.length)
			result.push(right.shift());
			
		return result
}

export function mergeSortMementoList(arr: Memento[]) : Memento[] {
	if (arr.length < 2)
		return arr;

	var middle = floor(arr.length / 2)
	var left   = arr.slice(0, middle)
	var right  = arr.slice(middle, arr.length)

	return _mergeMementoList(mergeSortMementoList(left), mergeSortMementoList(right));
}

function _mergeMementoList(left: Memento[], right: Memento[]): Memento[] {
		var result: Memento[] = [];
		
		while (left.length && right.length) {
			if (left[0].createdAt >= right[0].createdAt) {
				result.push(left.shift());
			} else {
				result.push(right.shift());
			}
		}

		while (left.length)
			result.push(left.shift());

		while (right.length)
			result.push(right.shift());
			
		return result
}

export function mergeSortUserList(arr: User[]) : User[] {
	if (arr.length < 2)
		return arr;

	var middle = floor(arr.length / 2)
	var left   = arr.slice(0, middle)
	var right  = arr.slice(middle, arr.length)

	return _mergeUserList(mergeSortUserList(left), mergeSortUserList(right));
}

function _mergeUserList(left: User[], right: User[]): User[] {
		var result: User[] = [];
		
		while (left.length && right.length) {
			if (left[0].createdAt >= right[0].createdAt) {
				result.push(left.shift());
			} else {
				result.push(right.shift());
			}
		}

		while (left.length)
			result.push(left.shift());

		while (right.length)
			result.push(right.shift());
			
		return result
}

export function mergeSortCommentList(arr: Comment[]) : Comment[] {
	if (arr.length < 2)
		return arr;

	var middle = floor(arr.length / 2)
	var left   = arr.slice(0, middle)
	var right  = arr.slice(middle, arr.length)

	return _mergeCommentList(mergeSortCommentList(left), mergeSortCommentList(right));
}

function _mergeCommentList(left: Comment[], right: Comment[]): Comment[] {
		var result: Comment[] = [];
		
		while (left.length && right.length) {
			if (left[0].createdAt >= right[0].createdAt) {
				result.push(left.shift());
			} else {
				result.push(right.shift());
			}
		}

		while (left.length)
			result.push(left.shift());

		while (right.length)
			result.push(right.shift());
			
		return result
}